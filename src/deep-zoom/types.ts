import type { DecimalString } from "../math/high-precision.ts";
import type { DeepZoomBackendId, FractalParameterValue } from "../fractals/types.ts";

export interface ReferenceOrbitRequest {
  readonly requestId: number;
  readonly backend: DeepZoomBackendId;
  readonly parameters: Readonly<Record<string, FractalParameterValue>>;
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
  readonly maxIterations: number;
  readonly viewportAspect: number;
}

export interface ReferenceOrbitResult {
  readonly requestId: number;
  readonly backend: DeepZoomBackendId;
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
  readonly precisionDigits: number;
  readonly orbitLength: number;
  readonly texelsPerIteration: number;
  readonly values: Float32Array;
}

export type ReferenceOrbitWorkerResponse =
  | {
      readonly type: "result";
      readonly result: ReferenceOrbitResult;
    }
  | {
      readonly type: "error";
      readonly requestId: number;
      readonly message: string;
    };
