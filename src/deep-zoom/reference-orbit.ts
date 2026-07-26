import Decimal from "decimal.js";
import { precisionForScale } from "../math/high-precision.ts";
import {
  createPlanePoint,
  getReferenceBackend,
  packReferenceState,
  referenceMagnitudeSquared,
} from "./reference-backends.ts";
import type { ReferenceOrbitRequest, ReferenceOrbitResult } from "./types.ts";

const REFERENCE_ESCAPE_LIMIT_SQUARED = 65_536;
const MAX_REFERENCE_ITERATIONS = 2_048;
const REFERENCE_SAMPLE_COORDINATES = [-0.42, -0.21, 0, 0.21, 0.42] as const;

export function calculateReferenceOrbit(request: ReferenceOrbitRequest): ReferenceOrbitResult {
  const precisionDigits = precisionForScale(request.scale);
  const D = Decimal.clone({
    precision: precisionDigits,
    rounding: Decimal.ROUND_HALF_EVEN,
  });
  const maxIterations = Math.max(
    1,
    Math.min(MAX_REFERENCE_ITERATIONS, Math.trunc(request.maxIterations)),
  );
  const planePoint = createPlanePoint(D, request.center);
  const backend = getReferenceBackend(request.backend);
  const orbit = new Float32Array((maxIterations + 1) * backend.texelsPerIteration * 4);
  let state = backend.initialize(D, planePoint, request.parameters);
  let orbitLength = 0;

  for (let iteration = 0; iteration <= maxIterations; iteration += 1) {
    packReferenceState(orbit, iteration, backend.texelsPerIteration, state);
    orbitLength = iteration + 1;

    const magnitudeSquared = referenceMagnitudeSquared(state);
    if (
      request.backend !== "newton-cubic-perturbation" &&
      iteration > 0 &&
      magnitudeSquared.greaterThan(REFERENCE_ESCAPE_LIMIT_SQUARED)
    ) {
      break;
    }

    const nextState = backend.iterate(D, state, planePoint, request.parameters);
    if (!nextState) {
      break;
    }
    state = nextState;
  }

  return {
    requestId: request.requestId,
    backend: request.backend,
    center: request.center,
    scale: request.scale,
    precisionDigits,
    orbitLength,
    texelsPerIteration: backend.texelsPerIteration,
    values: orbit.slice(0, orbitLength * backend.texelsPerIteration * 4),
  };
}

function referenceCandidates(
  request: ReferenceOrbitRequest,
): readonly (readonly [string, string])[] {
  const precisionDigits = precisionForScale(request.scale);
  const D = Decimal.clone({
    precision: precisionDigits,
    rounding: Decimal.ROUND_HALF_EVEN,
    toExpNeg: -1_000,
    toExpPos: 1_000,
  });
  const viewportAspect =
    Number.isFinite(request.viewportAspect) && request.viewportAspect > 0
      ? request.viewportAspect
      : 1;
  const centerReal = new D(request.center[0]);
  const centerImaginary = new D(request.center[1]);
  const scale = new D(request.scale);
  const candidates: [string, string][] = [[request.center[0], request.center[1]]];

  for (const normalizedY of REFERENCE_SAMPLE_COORDINATES) {
    for (const normalizedX of REFERENCE_SAMPLE_COORDINATES) {
      if (normalizedX === 0 && normalizedY === 0) {
        continue;
      }

      candidates.push([
        centerReal
          .plus(scale.times(normalizedX.toString()).times(viewportAspect.toString()))
          .toSignificantDigits(precisionDigits)
          .toString(),
        centerImaginary
          .plus(scale.times(normalizedY.toString()))
          .toSignificantDigits(precisionDigits)
          .toString(),
      ]);
    }
  }

  return candidates;
}

/**
 * A rapidly escaping reference orbit is both less stable and much shorter.
 * Sampling the visible area keeps perturbation quality tied to world
 * coordinates instead of the point that happens to be at screen center.
 */
export function calculateBestReferenceOrbit(request: ReferenceOrbitRequest): ReferenceOrbitResult {
  const maximumOrbitLength =
    Math.max(1, Math.min(MAX_REFERENCE_ITERATIONS, Math.trunc(request.maxIterations))) + 1;
  let bestResult: ReferenceOrbitResult | undefined;

  for (const center of referenceCandidates(request)) {
    const result = calculateReferenceOrbit({ ...request, center });

    if (!bestResult || result.orbitLength > bestResult.orbitLength) {
      bestResult = result;
    }
    if (result.orbitLength === maximumOrbitLength) {
      return result;
    }
  }

  return bestResult!;
}
