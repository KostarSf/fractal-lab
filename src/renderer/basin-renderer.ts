import { VERTEX_SHADER } from "../fractals/shader.ts";
import type { FractalParameterValue, RootBasinFormula } from "../fractals/types.ts";
import { createWebGLProgram, getUniform, type RenderState } from "./fractal-renderer.ts";
import { createBasinFragmentShader } from "./basin-shader.ts";

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

export class BasinRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #gl: WebGL2RenderingContext;
  readonly #vertexArray: WebGLVertexArrayObject;

  #formula: RootBasinFormula | undefined;
  #program: WebGLProgram | undefined;
  #uniforms = new Map<RequiredUniform, WebGLUniformLocation>();
  #parameterUniforms = new Map<string, WebGLUniformLocation>();

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 недоступен для root-basin renderer.");
    }
    const vertexArray = gl.createVertexArray();
    if (!vertexArray) {
      throw new Error("WebGL не смог создать root-basin vertex array.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#vertexArray = vertexArray;
  }

  setFormula(formula: RootBasinFormula): void {
    const program = createWebGLProgram(this.#gl, VERTEX_SHADER, createBasinFragmentShader(formula));
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
    if (!this.#formula || !this.#program) {
      throw new Error("Root-basin формула не выбрана.");
    }

    const gl = this.#gl;
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.useProgram(this.#program);
    gl.bindVertexArray(this.#vertexArray);
    gl.uniform2f(this.#uniforms.get("u_resolution")!, this.#canvas.width, this.#canvas.height);
    gl.uniform2f(this.#uniforms.get("u_center")!, state.center[0], state.center[1]);
    gl.uniform1f(this.#uniforms.get("u_scale")!, state.scale);
    gl.uniform1i(this.#uniforms.get("u_maxIterations")!, state.maxIterations);
    gl.uniform1i(this.#uniforms.get("u_palette")!, state.palette);
    gl.uniform1f(this.#uniforms.get("u_colorDensity")!, state.colorDensity);
    gl.uniform1f(this.#uniforms.get("u_colorOffset")!, state.colorOffset);
    gl.uniform1i(this.#uniforms.get("u_smoothColors")!, state.smoothColors ? 1 : 0);
    this.#setParameters(state.parameters);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    if (this.#program) {
      this.#gl.deleteProgram(this.#program);
      this.#program = undefined;
    }
    this.#gl.deleteVertexArray(this.#vertexArray);
  }

  #setParameters(parameters: Readonly<Record<string, FractalParameterValue>>): void {
    for (const parameter of this.#formula!.parameters) {
      const location = this.#parameterUniforms.get(parameter.key);
      const value = parameters[parameter.key];
      if (!location || value === undefined) {
        continue;
      }
      if (parameter.type === "complex" && Array.isArray(value)) {
        this.#gl.uniform2f(location, value[0], value[1]);
      } else if (parameter.type === "number" && typeof value === "number") {
        this.#gl.uniform1f(location, value);
      }
    }
  }
}
