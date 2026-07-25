import { calculateBestReferenceOrbit } from "./reference-orbit.ts";
import type { ReferenceOrbitRequest, ReferenceOrbitWorkerResponse } from "./types.ts";

interface WorkerScope {
  onmessage: ((event: MessageEvent<ReferenceOrbitRequest>) => void) | null;
  postMessage(message: ReferenceOrbitWorkerResponse, transfer: Transferable[]): void;
}

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = (event) => {
  try {
    const result = calculateBestReferenceOrbit(event.data);
    workerScope.postMessage({ type: "result", result }, [result.values.buffer]);
  } catch (error) {
    workerScope.postMessage(
      {
        type: "error",
        requestId: event.data.requestId,
        message: error instanceof Error ? error.message : String(error),
      },
      [],
    );
  }
};
