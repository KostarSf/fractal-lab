import type { ReferenceOrbitResult } from "../deep-zoom/types.ts";
import { VERTEX_SHADER } from "../fractals/shader.ts";
import type { ComplexValue } from "../fractals/types.ts";
import { createWebGLProgram, getUniform, type RenderState } from "./fractal-renderer.ts";
import { DEEP_ZOOM_FRAGMENT_SHADER } from "./deep-zoom-shader.ts";

export interface DeepZoomRenderState extends Omit<RenderState, "center" | "parameters"> {
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
  readonly #program: WebGLProgram;
  readonly #vertexArray: WebGLVertexArrayObject;
  readonly #orbitTexture: WebGLTexture;
  readonly #uniforms = new Map<UniformName, WebGLUniformLocation>();

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

    const vertexArray = gl.createVertexArray();
    const orbitTexture = gl.createTexture();
    if (!vertexArray || !orbitTexture) {
      throw new Error("WebGL не смог создать ресурсы deep zoom.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#vertexArray = vertexArray;
    this.#orbitTexture = orbitTexture;
    this.#program = createWebGLProgram(gl, VERTEX_SHADER, DEEP_ZOOM_FRAGMENT_SHADER);

    for (const name of UNIFORM_NAMES) {
      this.#uniforms.set(name, getUniform(gl, this.#program, name));
    }
  }

  setReferenceOrbit(reference: ReferenceOrbitResult): void {
    const gl = this.#gl;
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (reference.orbitLength > maxTextureSize) {
      throw new Error(
        `Опорная орбита (${reference.orbitLength}) превышает лимит GPU (${maxTextureSize}).`,
      );
    }

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
      reference.orbitLength,
      1,
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

    const gl = this.#gl;
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.useProgram(this.#program);
    gl.bindVertexArray(this.#vertexArray);
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

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    this.#gl.deleteTexture(this.#orbitTexture);
    this.#gl.deleteVertexArray(this.#vertexArray);
    this.#gl.deleteProgram(this.#program);
  }
}
