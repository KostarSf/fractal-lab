interface GpuFenceContext {
  readonly ALREADY_SIGNALED: number;
  readonly CONDITION_SATISFIED: number;
  readonly SYNC_GPU_COMMANDS_COMPLETE: number;
  readonly WAIT_FAILED: number;

  clientWaitSync(sync: WebGLSync, flags: number, timeout: number): number;
  deleteSync(sync: WebGLSync): void;
  fenceSync(condition: number, flags: number): WebGLSync | null;
  flush(): void;
}

interface AnimationFrameClock {
  cancel(handle: number): void;
  request(callback: FrameRequestCallback): number;
}

function browserAnimationFrameClock(): AnimationFrameClock {
  return {
    cancel: (handle) => window.cancelAnimationFrame(handle),
    request: (callback) => window.requestAnimationFrame(callback),
  };
}

/**
 * Keeps at most one submitted GPU frame in flight.
 *
 * WebGL draw calls cannot be interrupted after submission. The gate prevents
 * stale full frames from accumulating behind that unavoidable in-flight draw
 * and keeps only the latest callback that wants the next available frame.
 */
export class GpuFrameGate {
  readonly #gl: GpuFenceContext;
  readonly #clock: AnimationFrameClock;

  #frameSync: WebGLSync | undefined;
  #pollHandle: number | undefined;
  #availableCallback: (() => void) | undefined;

  constructor(gl: GpuFenceContext, clock = browserAnimationFrameClock()) {
    this.#gl = gl;
    this.#clock = clock;
  }

  canSubmitFrame(): boolean {
    return this.#releaseCompletedFrame();
  }

  markFrameSubmitted(): void {
    if (this.#frameSync) {
      throw new Error("Нельзя отправить новый GPU-кадр до завершения предыдущего.");
    }

    const sync = this.#gl.fenceSync(this.#gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) {
      return;
    }

    this.#frameSync = sync;
    this.#gl.flush();
  }

  whenFrameAvailable(callback: () => void): void {
    if (this.#releaseCompletedFrame()) {
      callback();
      return;
    }

    this.#availableCallback = callback;
    this.#schedulePoll();
  }

  dispose(): void {
    if (this.#pollHandle !== undefined) {
      this.#clock.cancel(this.#pollHandle);
    }
    if (this.#frameSync) {
      this.#gl.deleteSync(this.#frameSync);
    }

    this.#pollHandle = undefined;
    this.#frameSync = undefined;
    this.#availableCallback = undefined;
  }

  #releaseCompletedFrame(): boolean {
    if (!this.#frameSync) {
      return true;
    }

    const status = this.#gl.clientWaitSync(this.#frameSync, 0, 0);
    if (
      status !== this.#gl.ALREADY_SIGNALED &&
      status !== this.#gl.CONDITION_SATISFIED &&
      status !== this.#gl.WAIT_FAILED
    ) {
      return false;
    }

    this.#gl.deleteSync(this.#frameSync);
    this.#frameSync = undefined;
    return true;
  }

  #schedulePoll(): void {
    if (this.#pollHandle !== undefined) {
      return;
    }

    this.#pollHandle = this.#clock.request(() => {
      this.#pollHandle = undefined;
      if (!this.#releaseCompletedFrame()) {
        this.#schedulePoll();
        return;
      }

      const callback = this.#availableCallback;
      this.#availableCallback = undefined;
      callback?.();
    });
  }
}
