import { describe, expect, it, vi } from "vite-plus/test";
import { GpuFrameGate } from "./gpu-frame-gate.ts";

const ALREADY_SIGNALED = 1;
const CONDITION_SATISFIED = 2;
const TIMEOUT_EXPIRED = 3;
const WAIT_FAILED = 4;
const SYNC_GPU_COMMANDS_COMPLETE = 5;

function createHarness() {
  const sync = {} as WebGLSync;
  const statuses = [TIMEOUT_EXPIRED, TIMEOUT_EXPIRED, ALREADY_SIGNALED];
  const gl = {
    ALREADY_SIGNALED,
    CONDITION_SATISFIED,
    SYNC_GPU_COMMANDS_COMPLETE,
    WAIT_FAILED,
    clientWaitSync: vi.fn(() => statuses.shift() ?? ALREADY_SIGNALED),
    deleteSync: vi.fn(),
    fenceSync: vi.fn(() => sync),
    flush: vi.fn(),
  };
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextHandle = 0;
  const clock = {
    cancel: vi.fn((handle: number) => callbacks.delete(handle)),
    request: vi.fn((callback: FrameRequestCallback) => {
      const handle = ++nextHandle;
      callbacks.set(handle, callback);
      return handle;
    }),
  };

  return {
    clock,
    flushPoll() {
      const [handle, callback] = callbacks.entries().next().value as [number, FrameRequestCallback];
      callbacks.delete(handle);
      callback(0);
    },
    gate: new GpuFrameGate(gl, clock),
    gl,
    pendingPolls: callbacks,
    statuses,
    sync,
  };
}

describe("GpuFrameGate", () => {
  it("polls without blocking until the submitted frame completes", () => {
    const harness = createHarness();
    const available = vi.fn();

    harness.gate.markFrameSubmitted();
    expect(harness.gl.flush).toHaveBeenCalledOnce();
    expect(harness.gate.canSubmitFrame()).toBe(false);

    harness.gate.whenFrameAvailable(available);
    expect(harness.pendingPolls.size).toBe(1);
    harness.flushPoll();

    expect(available).toHaveBeenCalledOnce();
    expect(harness.gl.deleteSync).toHaveBeenCalledWith(harness.sync);
    expect(harness.gate.canSubmitFrame()).toBe(true);
  });

  it("keeps only the latest callback while the GPU is busy", () => {
    const harness = createHarness();
    const stale = vi.fn();
    const latest = vi.fn();

    harness.gate.markFrameSubmitted();
    harness.gate.whenFrameAvailable(stale);
    harness.gate.whenFrameAvailable(latest);
    harness.statuses.splice(0, harness.statuses.length, ALREADY_SIGNALED);
    harness.flushPoll();

    expect(stale).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledOnce();
  });

  it("cancels polling and releases the sync on dispose", () => {
    const harness = createHarness();

    harness.gate.markFrameSubmitted();
    harness.gate.whenFrameAvailable(vi.fn());
    harness.gate.dispose();

    expect(harness.clock.cancel).toHaveBeenCalledOnce();
    expect(harness.gl.deleteSync).toHaveBeenCalledWith(harness.sync);
    expect(harness.pendingPolls.size).toBe(0);
  });
});
