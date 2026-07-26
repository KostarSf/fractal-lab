import { calculateCliffordTrajectory } from "./clifford.ts";
import type { CliffordTrajectoryRequest, CliffordWorkerResponse } from "./types.ts";

interface WorkerScope {
  onmessage: ((event: MessageEvent<CliffordTrajectoryRequest>) => void) | null;
  postMessage(message: CliffordWorkerResponse, transfer: Transferable[]): void;
}

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = (event) => {
  try {
    const result = calculateCliffordTrajectory(event.data);
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
