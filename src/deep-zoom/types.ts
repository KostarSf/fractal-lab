import type { DecimalString } from "../math/high-precision.ts";

export interface ReferenceOrbitRequest {
  readonly requestId: number;
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
  readonly maxIterations: number;
  readonly viewportAspect: number;
}

export interface ReferenceOrbitResult {
  readonly requestId: number;
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
  readonly precisionDigits: number;
  readonly orbitLength: number;
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
