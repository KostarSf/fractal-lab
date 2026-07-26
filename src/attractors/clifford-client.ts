import type {
  CliffordTrajectoryRequest,
  CliffordTrajectoryResult,
  CliffordWorkerResponse,
} from "./types.ts";

export class CliffordTrajectoryCancelledError extends Error {
  constructor() {
    super("Расчёт аттрактора отменён.");
    this.name = "CliffordTrajectoryCancelledError";
  }
}

export class CliffordTrajectoryClient {
  #worker: Worker | undefined;
  #reject: ((reason: unknown) => void) | undefined;
  #nextRequestId = 0;

  request(input: Omit<CliffordTrajectoryRequest, "requestId">): Promise<CliffordTrajectoryResult> {
    this.cancel();

    const requestId = ++this.#nextRequestId;
    const worker = new Worker(new URL("./clifford.worker.ts", import.meta.url), {
      type: "module",
    });
    this.#worker = worker;

    return new Promise((resolve, reject) => {
      this.#reject = reject;

      worker.onmessage = (event: MessageEvent<CliffordWorkerResponse>) => {
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
        reject(new Error(event.message || "Ошибка worker аттрактора Clifford."));
      };

      worker.postMessage({ ...input, requestId } satisfies CliffordTrajectoryRequest);
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
    reject?.(new CliffordTrajectoryCancelledError());
  }

  #finish(): void {
    this.#worker?.terminate();
    this.#worker = undefined;
    this.#reject = undefined;
  }
}
