import type { ReferenceOrbitResult } from "../deep-zoom/types.ts";
import { VERTEX_SHADER } from "../fractals/shader.ts";
import type { ComplexValue, DeepZoomBackendId, FractalParameterValue } from "../fractals/types.ts";
import { createWebGLProgram, getUniform, type RenderState } from "./fractal-renderer.ts";
import { createDeepZoomFragmentShader, deepZoomTexelsPerIteration } from "./deep-zoom-shader.ts";
import { FullscreenTriangle } from "./fullscreen-triangle.ts";

export interface DeepZoomRenderState extends Omit<RenderState, "center"> {
  readonly backend: DeepZoomBackendId;
  readonly centerDelta: ComplexValue;
}

const UNIFORM_NAMES = [
  "u_resolution",
  "u_centerDelta",
  "u_scale",
  "u_maxIterations",
  "u_palette",
  "u_colorDensity",
  "u_colorOffset",
  "u_smoothColors",
  "u_referenceOrbit",
  "u_referenceCount",
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

export class DeepZoomRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #gl: WebGL2RenderingContext;
  readonly #fullscreenTriangle: FullscreenTriangle;
  readonly #orbitTexture: WebGLTexture;

  #backend: DeepZoomBackendId | undefined;
  #program: WebGLProgram | undefined;
  #uniforms = new Map<UniformName, WebGLUniformLocation>();
  #parameterUniforms = new Map<string, WebGLUniformLocation>();
  #referenceCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
    });
    if (!gl) {
      throw new Error("WebGL2 недоступен для deep zoom.");
    }

    const orbitTexture = gl.createTexture();
    if (!orbitTexture) {
      throw new Error("WebGL не смог создать ресурсы deep zoom.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#fullscreenTriangle = new FullscreenTriangle(gl);
    this.#orbitTexture = orbitTexture;
    this.#setBackend("mandelbrot-perturbation");
  }

  setReferenceOrbit(reference: ReferenceOrbitResult): void {
    const gl = this.#gl;
    const expectedTexels = deepZoomTexelsPerIteration(reference.backend);
    if (reference.texelsPerIteration !== expectedTexels) {
      throw new Error(
        `Deep-zoom backend ${reference.backend} ожидал ${expectedTexels} texel на итерацию, получено ${reference.texelsPerIteration}.`,
      );
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (reference.orbitLength > maxTextureSize || reference.texelsPerIteration > maxTextureSize) {
      throw new Error(
        `Опорная орбита (${reference.orbitLength} итераций) превышает лимит GPU (${maxTextureSize}).`,
      );
    }

    this.#setBackend(reference.backend);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.#orbitTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      reference.texelsPerIteration,
      reference.orbitLength,
      0,
      gl.RGBA,
      gl.FLOAT,
      reference.values,
    );
    this.#referenceCount = reference.orbitLength;
  }

  resize(quality: number): boolean {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * quality;
    const width = Math.max(1, Math.round(this.#canvas.clientWidth * pixelRatio));
    const height = Math.max(1, Math.round(this.#canvas.clientHeight * pixelRatio));

    if (this.#canvas.width === width && this.#canvas.height === height) {
      return false;
    }

    this.#canvas.width = width;
    this.#canvas.height = height;
    return true;
  }

  render(state: DeepZoomRenderState): void {
    if (this.#referenceCount < 2) {
      throw new Error("Опорная орбита deep zoom ещё не подготовлена.");
    }
    if (state.backend !== this.#backend || !this.#program) {
      throw new Error("Deep-zoom renderer получил состояние другого backend'а.");
    }

    const gl = this.#gl;
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.useProgram(this.#program);
    this.#fullscreenTriangle.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.#orbitTexture);

    gl.uniform2f(this.#uniforms.get("u_resolution")!, this.#canvas.width, this.#canvas.height);
    gl.uniform2f(this.#uniforms.get("u_centerDelta")!, state.centerDelta[0], state.centerDelta[1]);
    gl.uniform1f(this.#uniforms.get("u_scale")!, state.scale);
    gl.uniform1i(this.#uniforms.get("u_maxIterations")!, state.maxIterations);
    gl.uniform1i(this.#uniforms.get("u_palette")!, state.palette);
    gl.uniform1f(this.#uniforms.get("u_colorDensity")!, state.colorDensity);
    gl.uniform1f(this.#uniforms.get("u_colorOffset")!, state.colorOffset);
    gl.uniform1i(this.#uniforms.get("u_smoothColors")!, state.smoothColors ? 1 : 0);
    gl.uniform1i(this.#uniforms.get("u_referenceOrbit")!, 0);
    gl.uniform1i(this.#uniforms.get("u_referenceCount")!, this.#referenceCount);
    this.#setParameters(state.parameters);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    this.#gl.deleteTexture(this.#orbitTexture);
    this.#fullscreenTriangle.dispose();
    if (this.#program) {
      this.#gl.deleteProgram(this.#program);
    }
  }

  #setBackend(backend: DeepZoomBackendId): void {
    if (backend === this.#backend) {
      return;
    }

    const program = createWebGLProgram(
      this.#gl,
      VERTEX_SHADER,
      createDeepZoomFragmentShader(backend),
    );
    const uniforms = new Map<UniformName, WebGLUniformLocation>();
    for (const name of UNIFORM_NAMES) {
      uniforms.set(name, getUniform(this.#gl, program, name));
    }

    const parameterUniforms = new Map<string, WebGLUniformLocation>();
    const parameterNames: readonly (readonly [key: string, uniform: string])[] =
      backend === "julia-perturbation"
        ? [["constant", "u_juliaConstant"]]
        : backend === "phoenix-perturbation"
          ? [
              ["constant", "u_phoenixConstant"],
              ["memory", "u_phoenixMemory"],
            ]
          : backend === "newton-cubic-perturbation"
            ? [["tolerance", "u_convergenceTolerance"]]
            : backend === "nova-cubic-perturbation"
              ? [
                  ["relaxation", "u_novaRelaxation"],
                  ["escapeRadius", "u_novaEscapeRadius"],
                  ["tolerance", "u_convergenceTolerance"],
                ]
              : [];
    for (const [key, uniformName] of parameterNames) {
      parameterUniforms.set(key, getUniform(this.#gl, program, uniformName));
    }

    if (this.#program) {
      this.#gl.deleteProgram(this.#program);
    }
    this.#backend = backend;
    this.#program = program;
    this.#uniforms = uniforms;
    this.#parameterUniforms = parameterUniforms;
    this.#referenceCount = 0;
  }

  #setParameters(parameters: Readonly<Record<string, FractalParameterValue>>): void {
    for (const [key, uniform] of this.#parameterUniforms) {
      const value = parameters[key];
      if (Array.isArray(value)) {
        this.#gl.uniform2f(uniform, value[0]!, value[1]!);
      } else if (typeof value === "number") {
        this.#gl.uniform1f(uniform, value);
      } else if (key === "constant" && this.#backend === "julia-perturbation") {
        this.#gl.uniform2f(uniform, -0.745, 0.113);
      } else if (key === "constant" && this.#backend === "phoenix-perturbation") {
        this.#gl.uniform2f(uniform, 0.5667, 0);
      } else if (key === "memory") {
        this.#gl.uniform1f(uniform, -0.5);
      }
    }
  }
}
