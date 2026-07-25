import type {
  ReferenceOrbitRequest,
  ReferenceOrbitResult,
  ReferenceOrbitWorkerResponse,
} from "./types.ts";

export class ReferenceOrbitCancelledError extends Error {
  constructor() {
    super("Расчёт опорной орбиты отменён.");
    this.name = "ReferenceOrbitCancelledError";
  }
}

export class ReferenceOrbitClient {
  #worker: Worker | undefined;
  #reject: ((reason: unknown) => void) | undefined;
  #nextRequestId = 0;

  request(input: Omit<ReferenceOrbitRequest, "requestId">): Promise<ReferenceOrbitResult> {
    this.cancel();

    const requestId = ++this.#nextRequestId;
    const worker = new Worker(new URL("./reference-orbit.worker.ts", import.meta.url), {
      type: "module",
    });
    this.#worker = worker;

    return new Promise((resolve, reject) => {
      this.#reject = reject;

      worker.onmessage = (event: MessageEvent<ReferenceOrbitWorkerResponse>) => {
        const response = event.data;
        if (response.type === "error" && response.requestId === requestId) {
          this.#finish();
          reject(new Error(response.message));
          return;
        }

        if (response.type === "result" && response.result.requestId === requestId) {
          this.#finish();
          resolve(response.result);
        }
      };

      worker.onerror = (event) => {
        this.#finish();
        reject(new Error(event.message || "Ошибка deep-zoom worker."));
      };

      worker.postMessage({ ...input, requestId } satisfies ReferenceOrbitRequest);
    });
  }

  cancel(): void {
    if (!this.#worker) {
      return;
    }

    this.#worker.terminate();
    this.#worker = undefined;
    const reject = this.#reject;
    this.#reject = undefined;
    reject?.(new ReferenceOrbitCancelledError());
  }

  #finish(): void {
    this.#worker?.terminate();
    this.#worker = undefined;
    this.#reject = undefined;
  }
}
