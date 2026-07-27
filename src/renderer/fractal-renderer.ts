import { createFragmentShader, VERTEX_SHADER } from "../fractals/shader.ts";
import type { ComplexValue, EscapeTimeFormula, FractalParameterValue } from "../fractals/types.ts";
import { FullscreenTriangle } from "./fullscreen-triangle.ts";

export interface RenderState {
  readonly center: ComplexValue;
  readonly scale: number;
  readonly maxIterations: number;
  readonly palette: number;
  readonly colorDensity: number;
  readonly colorOffset: number;
  readonly smoothColors: boolean;
  readonly parameters: Readonly<Record<string, FractalParameterValue>>;
}

const REQUIRED_UNIFORMS = [
  "u_resolution",
  "u_center",
  "u_scale",
  "u_maxIterations",
  "u_palette",
  "u_colorDensity",
  "u_colorOffset",
  "u_smoothColors",
] as const;

type RequiredUniform = (typeof REQUIRED_UNIFORMS)[number];

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("WebGL не смог создать шейдер.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Неизвестная ошибка компиляции.";
    gl.deleteShader(shader);
    throw new Error(`Ошибка компиляции GLSL:\n${log}`);
  }

  return shader;
}

export function createWebGLProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error("WebGL не смог создать программу.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "Неизвестная ошибка линковки.";
    gl.deleteProgram(program);
    throw new Error(`Ошибка линковки WebGL-программы:\n${log}`);
  }

  return program;
}

export function getUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLUniformLocation {
  const location = gl.getUniformLocation(program, name);
  if (location === null) {
    throw new Error(`Uniform ${name} отсутствует в шейдере.`);
  }
  return location;
}

export class FractalRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #gl: WebGL2RenderingContext;
  readonly #fullscreenTriangle: FullscreenTriangle;

  #formula: EscapeTimeFormula | undefined;
  #program: WebGLProgram | undefined;
  #uniforms = new Map<RequiredUniform, WebGLUniformLocation>();
  #parameterUniforms = new Map<string, WebGLUniformLocation>();

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
      throw new Error("WebGL2 недоступен. Проверьте поддержку браузера и аппаратное ускорение.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#fullscreenTriangle = new FullscreenTriangle(gl);
  }

  setFormula(formula: EscapeTimeFormula): void {
    const program = createWebGLProgram(this.#gl, VERTEX_SHADER, createFragmentShader(formula));
    const uniforms = new Map<RequiredUniform, WebGLUniformLocation>();
    const parameterUniforms = new Map<string, WebGLUniformLocation>();

    for (const name of REQUIRED_UNIFORMS) {
      uniforms.set(name, getUniform(this.#gl, program, name));
    }

    for (const parameter of formula.parameters) {
      parameterUniforms.set(parameter.key, getUniform(this.#gl, program, parameter.uniform));
    }

    if (this.#program) {
      this.#gl.deleteProgram(this.#program);
    }

    this.#formula = formula;
    this.#program = program;
    this.#uniforms = uniforms;
    this.#parameterUniforms = parameterUniforms;
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

  render(state: RenderState): void {
    if (!this.#program || !this.#formula) {
      throw new Error("Формула не выбрана.");
    }

    const gl = this.#gl;
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.useProgram(this.#program);
    this.#fullscreenTriangle.bind();

    gl.uniform2f(this.#uniforms.get("u_resolution")!, this.#canvas.width, this.#canvas.height);
    gl.uniform2f(this.#uniforms.get("u_center")!, state.center[0], state.center[1]);
    gl.uniform1f(this.#uniforms.get("u_scale")!, state.scale);
    gl.uniform1i(this.#uniforms.get("u_maxIterations")!, state.maxIterations);
    gl.uniform1i(this.#uniforms.get("u_palette")!, state.palette);
    gl.uniform1f(this.#uniforms.get("u_colorDensity")!, state.colorDensity);
    gl.uniform1f(this.#uniforms.get("u_colorOffset")!, state.colorOffset);
    gl.uniform1i(this.#uniforms.get("u_smoothColors")!, state.smoothColors ? 1 : 0);

    for (const parameter of this.#formula.parameters) {
      const location = this.#parameterUniforms.get(parameter.key);
      const value = state.parameters[parameter.key];

      if (!location || value === undefined) {
        continue;
      }

      if (parameter.type === "complex" && Array.isArray(value)) {
        gl.uniform2f(location, value[0], value[1]);
      } else if (parameter.type === "number" && typeof value === "number") {
        gl.uniform1f(location, value);
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    if (this.#program) {
      this.#gl.deleteProgram(this.#program);
      this.#program = undefined;
    }
    this.#fullscreenTriangle.dispose();
  }
}
