import Decimal from "decimal.js";
import { precisionForScale, type DecimalString } from "../math/high-precision.ts";
import type { DeepZoomBackendId } from "../fractals/types.ts";
import type { ReferenceOrbitResult } from "./types.ts";

const VIEWPORT_REUSE_MARGIN = 1.2;
const MAX_ZOOM_OUT_FACTOR = 1.05;

export interface ReferenceViewport {
  readonly backend: DeepZoomBackendId;
  readonly parameterSignature: string;
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
  readonly maxIterations: number;
  readonly viewportAspect: number;
}

export function canReuseReferenceRequest(
  source: ReferenceViewport,
  target: ReferenceViewport,
): boolean {
  if (
    source.backend !== target.backend ||
    source.parameterSignature !== target.parameterSignature ||
    source.maxIterations < target.maxIterations ||
    precisionForScale(source.scale) < precisionForScale(target.scale)
  ) {
    return false;
  }

  const precisionDigits = Math.max(
    precisionForScale(source.scale),
    precisionForScale(target.scale),
  );
  const D = Decimal.clone({
    precision: precisionDigits,
    rounding: Decimal.ROUND_HALF_EVEN,
    toExpNeg: -1_000,
    toExpPos: 1_000,
  });
  const sourceScale = new D(source.scale);
  const targetScale = new D(target.scale);
  if (targetScale.greaterThan(sourceScale.times(MAX_ZOOM_OUT_FACTOR))) {
    return false;
  }

  const sourceAspect = safeAspect(source.viewportAspect);
  const targetAspect = safeAspect(target.viewportAspect);
  const realShift = new D(target.center[0]).minus(source.center[0]).absoluteValue();
  const imaginaryShift = new D(target.center[1]).minus(source.center[1]).absoluteValue();
  const sourceHalfWidth = sourceScale.times(sourceAspect).times(0.5);
  const sourceHalfHeight = sourceScale.times(0.5);
  const targetHalfWidth = targetScale.times(targetAspect).times(0.5);
  const targetHalfHeight = targetScale.times(0.5);

  return (
    realShift
      .plus(targetHalfWidth)
      .lessThanOrEqualTo(sourceHalfWidth.times(VIEWPORT_REUSE_MARGIN)) &&
    imaginaryShift
      .plus(targetHalfHeight)
      .lessThanOrEqualTo(sourceHalfHeight.times(VIEWPORT_REUSE_MARGIN))
  );
}

export function canReuseReferenceOrbit(
  reference: ReferenceOrbitResult,
  source: ReferenceViewport,
  target: ReferenceViewport,
): boolean {
  return (
    reference.backend === source.backend &&
    reference.precisionDigits >= precisionForScale(target.scale) &&
    reference.orbitLength > target.maxIterations &&
    canReuseReferenceRequest(source, target)
  );
}

export function canAcceptCalculatedReferenceOrbit(
  reference: ReferenceOrbitResult,
  source: ReferenceViewport,
  target: ReferenceViewport,
): boolean {
  return (
    reference.backend === source.backend &&
    reference.orbitLength >= 2 &&
    reference.precisionDigits >= precisionForScale(target.scale) &&
    canReuseReferenceRequest(source, target)
  );
}

function safeAspect(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
