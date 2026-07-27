const FULLSCREEN_TRIANGLE_POSITIONS = new Float32Array([-1, -1, 3, -1, -1, 3]);

export class FullscreenTriangle {
  readonly #gl: WebGL2RenderingContext;
  readonly #vertexArray: WebGLVertexArrayObject;
  readonly #vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    const vertexArray = gl.createVertexArray();
    const vertexBuffer = gl.createBuffer();

    if (!vertexArray || !vertexBuffer) {
      if (vertexArray) {
        gl.deleteVertexArray(vertexArray);
      }
      if (vertexBuffer) {
        gl.deleteBuffer(vertexBuffer);
      }
      throw new Error("WebGL не смог создать fullscreen triangle.");
    }

    this.#gl = gl;
    this.#vertexArray = vertexArray;
    this.#vertexBuffer = vertexBuffer;

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE_POSITIONS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  bind(): void {
    this.#gl.bindVertexArray(this.#vertexArray);
  }

  dispose(): void {
    this.#gl.deleteBuffer(this.#vertexBuffer);
    this.#gl.deleteVertexArray(this.#vertexArray);
  }
}
