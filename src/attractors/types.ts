export interface CliffordTrajectoryRequest {
  readonly requestId: number;
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly burnIn: number;
  readonly pointCount: number;
}

export interface CliffordTrajectoryResult {
  readonly requestId: number;
  readonly pointCount: number;
  readonly values: Float32Array;
  readonly bounds: readonly [minX: number, minY: number, maxX: number, maxY: number];
}

export type CliffordWorkerResponse =
  | {
      readonly type: "result";
      readonly result: CliffordTrajectoryResult;
    }
  | {
      readonly type: "error";
      readonly requestId: number;
      readonly message: string;
    };
