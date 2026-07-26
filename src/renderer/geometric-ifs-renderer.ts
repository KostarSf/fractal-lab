import type {
  ComplexValue,
  GeometricColoring,
  GeometricIfsFormula,
  RecursionDepthMode,
} from "../fractals/types.ts";
import {
  MAX_GRID_CELLS,
  resolveAutoRecursionDepth,
  validateGeometricIfsRule,
} from "../geometric-ifs/rules.ts";
import { VERTEX_SHADER } from "../fractals/shader.ts";
import { createWebGLProgram, getUniform } from "./fractal-renderer.ts";
import { GEOMETRIC_IFS_FRAGMENT_SHADER } from "./geometric-ifs-shader.ts";

export interface GeometricIfsRenderState {
  readonly center: ComplexValue;
  readonly scale: number;
  readonly recursionDepthMode: RecursionDepthMode;
  readonly recursionDepth: number;
  readonly coloring: GeometricColoring;
  readonly palette: number;
  readonly colorOffset: number;
}

const UNIFORM_NAMES = [
  "u_resolution",
  "u_center",
  "u_scale",
  "u_ruleType",
  "u_baseSize",
  "u_triangleA",
  "u_triangleB",
  "u_triangleC",
  "u_gridSize",
  "u_gridMask[0]",
  "u_contractionRatio",
  "u_recursionDepth",
  "u_autoDepth",
  "u_palette",
  "u_colorMode",
  "u_colorOffset",
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

const COLORING_IDS: Readonly<Record<GeometricColoring, number>> = {
  solid: 0,
  level: 1,
  gradient: 2,
};

export class GeometricIfsRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #gl: WebGL2RenderingContext;
  readonly #program: WebGLProgram;
  readonly #vertexArray: WebGLVertexArrayObject;
  readonly #uniforms = new Map<UniformName, WebGLUniformLocation>();

  #formula: GeometricIfsFormula | undefined;

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
      throw new Error("WebGL2 недоступен для geometric IFS renderer.");
    }
    const vertexArray = gl.createVertexArray();
    if (!vertexArray) {
      throw new Error("WebGL не смог создать vertex array для geometric IFS.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#program = createWebGLProgram(gl, VERTEX_SHADER, GEOMETRIC_IFS_FRAGMENT_SHADER);
    this.#vertexArray = vertexArray;
    gl.bindVertexArray(vertexArray);

    for (const name of UNIFORM_NAMES) {
      this.#uniforms.set(name, getUniform(gl, this.#program, name));
    }
  }

  setFormula(formula: GeometricIfsFormula): void {
    validateGeometricIfsRule(formula.geometricIfs);
    this.#formula = formula;
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

  render(state: GeometricIfsRenderState): void {
    const formula = this.#formula;
    if (!formula) {
      throw new Error("Geometric IFS-фрактал не выбран.");
    }

    const gl = this.#gl;
    const rule = formula.geometricIfs;
    const autoDepth = resolveAutoRecursionDepth(state.scale, this.#canvas.height, rule);
    const recursionDepth =
      state.recursionDepthMode === "auto"
        ? autoDepth
        : Math.max(1, Math.min(rule.recommendedMaxDepth, Math.trunc(state.recursionDepth)));
    const mask = new Int32Array(MAX_GRID_CELLS);
    let baseSize: readonly [number, number] = [2, 2];
    let gridSize: readonly [number, number] = [3, 3];
    let triangleVertices: readonly [ComplexValue, ComplexValue, ComplexValue] = [
      [-1, -1],
      [1, -1],
      [0, 1],
    ];

    if (rule.backend === "grid") {
      baseSize = rule.baseArea.size;
      gridSize = [rule.grid.columns, rule.grid.rows];
      rule.grid.mask.forEach((retained, index) => {
        mask[index] = retained ? 1 : 0;
      });
    } else {
      triangleVertices = rule.baseArea.vertices;
      const x = triangleVertices.map((vertex) => vertex[0]);
      const y = triangleVertices.map((vertex) => vertex[1]);
      baseSize = [Math.max(...x) - Math.min(...x), Math.max(...y) - Math.min(...y)];
    }

    gl.disable(gl.BLEND);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.useProgram(this.#program);
    gl.bindVertexArray(this.#vertexArray);
    gl.uniform2f(this.#uniforms.get("u_resolution")!, this.#canvas.width, this.#canvas.height);
    gl.uniform2f(this.#uniforms.get("u_center")!, state.center[0], state.center[1]);
    gl.uniform1f(this.#uniforms.get("u_scale")!, state.scale);
    gl.uniform1i(this.#uniforms.get("u_ruleType")!, rule.backend === "grid" ? 0 : 1);
    gl.uniform2f(this.#uniforms.get("u_baseSize")!, baseSize[0], baseSize[1]);
    gl.uniform2f(
      this.#uniforms.get("u_triangleA")!,
      triangleVertices[0][0],
      triangleVertices[0][1],
    );
    gl.uniform2f(
      this.#uniforms.get("u_triangleB")!,
      triangleVertices[1][0],
      triangleVertices[1][1],
    );
    gl.uniform2f(
      this.#uniforms.get("u_triangleC")!,
      triangleVertices[2][0],
      triangleVertices[2][1],
    );
    gl.uniform2i(this.#uniforms.get("u_gridSize")!, gridSize[0], gridSize[1]);
    gl.uniform1iv(this.#uniforms.get("u_gridMask[0]")!, mask);
    gl.uniform1f(this.#uniforms.get("u_contractionRatio")!, rule.contractionRatio);
    gl.uniform1i(this.#uniforms.get("u_recursionDepth")!, recursionDepth);
    gl.uniform1i(this.#uniforms.get("u_autoDepth")!, state.recursionDepthMode === "auto" ? 1 : 0);
    gl.uniform1i(this.#uniforms.get("u_palette")!, state.palette);
    gl.uniform1i(this.#uniforms.get("u_colorMode")!, COLORING_IDS[state.coloring]);
    gl.uniform1f(this.#uniforms.get("u_colorOffset")!, state.colorOffset);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    this.#gl.deleteProgram(this.#program);
    this.#gl.deleteVertexArray(this.#vertexArray);
  }
}
