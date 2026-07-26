import type { ComplexValue } from "../fractals/types.ts";
import { createWebGLProgram, getUniform } from "./fractal-renderer.ts";

export interface CliffordRenderState {
  readonly center: ComplexValue;
  readonly scale: number;
  readonly palette: number;
  readonly colorOffset: number;
  readonly exposure: number;
  readonly pointSize: number;
  readonly pointFraction: number;
}

const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_pointSize;
uniform int u_pointCount;

out float v_progress;
out vec2 v_position;

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 position = vec2(
    2.0 * (a_position.x - u_center.x) / (u_scale * aspect),
    2.0 * (a_position.y - u_center.y) / u_scale
  );
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  v_progress = float(gl_VertexID) / max(float(u_pointCount - 1), 1.0);
  v_position = a_position;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in float v_progress;
in vec2 v_position;
out vec4 outColor;

uniform int u_palette;
uniform float u_colorOffset;
uniform float u_exposure;

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(t, vec3(0.50), vec3(0.50), vec3(1.0), vec3(0.00, 0.10, 0.20));
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

void main() {
  float radius = length(gl_PointCoord - vec2(0.5));
  float coverage = 1.0 - smoothstep(0.28, 0.5, radius);
  float colorPosition =
    dot(v_position, vec2(0.11, 0.17)) +
    v_progress * 0.025 +
    u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));
  outColor = vec4(color, coverage * u_exposure);
}
`;

const UNIFORM_NAMES = [
  "u_resolution",
  "u_center",
  "u_scale",
  "u_pointSize",
  "u_pointCount",
  "u_palette",
  "u_colorOffset",
  "u_exposure",
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

export class CliffordRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #gl: WebGL2RenderingContext;
  readonly #program: WebGLProgram;
  readonly #vertexArray: WebGLVertexArrayObject;
  readonly #pointBuffer: WebGLBuffer;
  readonly #uniforms = new Map<UniformName, WebGLUniformLocation>();
  readonly #maxPointSize: number;

  #pointCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 недоступен для Clifford renderer.");
    }
    const vertexArray = gl.createVertexArray();
    const pointBuffer = gl.createBuffer();
    if (!vertexArray || !pointBuffer) {
      throw new Error("WebGL не смог создать ресурсы Clifford renderer.");
    }

    this.#canvas = canvas;
    this.#gl = gl;
    this.#program = createWebGLProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    this.#vertexArray = vertexArray;
    this.#pointBuffer = pointBuffer;

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    for (const name of UNIFORM_NAMES) {
      this.#uniforms.set(name, getUniform(gl, this.#program, name));
    }

    const pointSizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array;
    this.#maxPointSize = pointSizeRange[1] ?? 1;
  }

  setPoints(points: Float32Array): void {
    const gl = this.#gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    this.#pointCount = Math.trunc(points.length / 2);
  }

  clearPoints(): void {
    this.#pointCount = 0;
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

  render(state: CliffordRenderState): void {
    const gl = this.#gl;
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    gl.clearColor(0.004, 0.006, 0.012, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.#pointCount === 0) {
      return;
    }

    const pixelRatio =
      this.#canvas.clientWidth > 0 ? this.#canvas.width / this.#canvas.clientWidth : 1;
    const pointSize = Math.min(this.#maxPointSize, Math.max(1, state.pointSize * pixelRatio));
    const drawCount = Math.max(
      1,
      Math.min(
        this.#pointCount,
        Math.trunc(this.#pointCount * Math.max(0.05, Math.min(1, state.pointFraction))),
      ),
    );

    gl.useProgram(this.#program);
    gl.bindVertexArray(this.#vertexArray);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.uniform2f(this.#uniforms.get("u_resolution")!, this.#canvas.width, this.#canvas.height);
    gl.uniform2f(this.#uniforms.get("u_center")!, state.center[0], state.center[1]);
    gl.uniform1f(this.#uniforms.get("u_scale")!, state.scale);
    gl.uniform1f(this.#uniforms.get("u_pointSize")!, pointSize);
    gl.uniform1i(this.#uniforms.get("u_pointCount")!, drawCount);
    gl.uniform1i(this.#uniforms.get("u_palette")!, state.palette);
    gl.uniform1f(this.#uniforms.get("u_colorOffset")!, state.colorOffset);
    gl.uniform1f(this.#uniforms.get("u_exposure")!, Math.max(0, state.exposure));
    gl.drawArrays(gl.POINTS, 0, drawCount);
    gl.disable(gl.BLEND);
  }

  dispose(): void {
    this.#gl.deleteBuffer(this.#pointBuffer);
    this.#gl.deleteVertexArray(this.#vertexArray);
    this.#gl.deleteProgram(this.#program);
  }
}
