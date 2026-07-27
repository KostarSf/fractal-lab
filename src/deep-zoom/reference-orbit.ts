import Decimal from "decimal.js";
import { precisionForScale } from "../math/high-precision.ts";
import {
  createPlanePoint,
  getReferenceBackend,
  iteratePerturbation,
  packReferenceState,
  referenceMagnitudeSquared,
} from "./reference-backends.ts";
import type { ReferenceOrbitRequest, ReferenceOrbitResult } from "./types.ts";
import type { ComplexValue } from "../fractals/types.ts";

const REFERENCE_ESCAPE_LIMIT_SQUARED = 65_536;
const MAX_REFERENCE_ITERATIONS = 2_048;
const REFERENCE_SAMPLE_COORDINATES = [-0.42, -0.21, 0, 0.21, 0.42] as const;
const NOVA_EARLY_EXIT_MINIMUM_MAGNITUDE_SQUARED = 0.0625;

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
    candidateCount: 1,
  };
}

interface ReferenceCandidate {
  readonly center: readonly [string, string];
  readonly planeDelta: ComplexValue;
}

function referenceCandidates(request: ReferenceOrbitRequest): readonly ReferenceCandidate[] {
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
  const candidates: ReferenceCandidate[] = [
    {
      center: [request.center[0], request.center[1]],
      planeDelta: [0, 0],
    },
  ];

  for (const normalizedY of REFERENCE_SAMPLE_COORDINATES) {
    for (const normalizedX of REFERENCE_SAMPLE_COORDINATES) {
      if (normalizedX === 0 && normalizedY === 0) {
        continue;
      }

      candidates.push({
        center: [
          centerReal
            .plus(scale.times(normalizedX.toString()).times(viewportAspect.toString()))
            .toSignificantDigits(precisionDigits)
            .toString(),
          centerImaginary
            .plus(scale.times(normalizedY.toString()))
            .toSignificantDigits(precisionDigits)
            .toString(),
        ],
        planeDelta: [
          scale.times(normalizedX.toString()).times(viewportAspect.toString()).toNumber(),
          scale.times(normalizedY.toString()).toNumber(),
        ],
      });
    }
  }

  return candidates;
}

function referencePoint(result: ReferenceOrbitResult, iteration: number): ComplexValue {
  const offset = iteration * result.texelsPerIteration * 4;
  return [
    result.values[offset]! + result.values[offset + 2]!,
    result.values[offset + 1]! + result.values[offset + 3]!,
  ];
}

function estimateNovaCandidateConditioning(
  reference: ReferenceOrbitResult,
  candidate: ReferenceCandidate,
  parameters: ReferenceOrbitRequest["parameters"],
): ReferenceConditioning {
  let delta = {
    current: [0, 0] as ComplexValue,
    previous: [0, 0] as ComplexValue,
  };
  let maximumMagnitudeSquared = 0;
  let minimumMagnitudeSquared = Number.POSITIVE_INFINITY;

  for (let iteration = 0; iteration < reference.orbitLength; iteration += 1) {
    const current = referencePoint(reference, iteration);
    const actualReal = current[0] + delta.current[0];
    const actualImaginary = current[1] + delta.current[1];
    const magnitudeSquared = actualReal * actualReal + actualImaginary * actualImaginary;
    if (!Number.isFinite(magnitudeSquared)) {
      return {
        maximumMagnitudeSquared: Number.POSITIVE_INFINITY,
        minimumMagnitudeSquared: 0,
      };
    }
    maximumMagnitudeSquared = Math.max(maximumMagnitudeSquared, magnitudeSquared);
    minimumMagnitudeSquared = Math.min(minimumMagnitudeSquared, magnitudeSquared);

    if (iteration + 1 >= reference.orbitLength) {
      break;
    }
    delta = iteratePerturbation(
      "nova-cubic-perturbation",
      { current, previous: current },
      delta,
      candidate.planeDelta,
      parameters,
    );
  }

  return {
    maximumMagnitudeSquared,
    minimumMagnitudeSquared,
  };
}

function rankNovaCandidates(
  reference: ReferenceOrbitResult,
  candidates: readonly ReferenceCandidate[],
  parameters: ReferenceOrbitRequest["parameters"],
): readonly ReferenceCandidate[] {
  return candidates
    .map((candidate) => ({
      candidate,
      conditioning: estimateNovaCandidateConditioning(reference, candidate, parameters),
    }))
    .sort((left, right) => {
      const minimumDifference =
        right.conditioning.minimumMagnitudeSquared - left.conditioning.minimumMagnitudeSquared;
      if (minimumDifference !== 0) {
        return minimumDifference;
      }
      return left.conditioning.maximumMagnitudeSquared - right.conditioning.maximumMagnitudeSquared;
    })
    .map(({ candidate }) => candidate);
}

interface ReferenceConditioning {
  readonly maximumMagnitudeSquared: number;
  readonly minimumMagnitudeSquared: number;
}

function referenceConditioning(result: ReferenceOrbitResult): ReferenceConditioning {
  let maximumMagnitudeSquared = 0;
  let minimumMagnitudeSquared = Number.POSITIVE_INFINITY;

  for (let iteration = 0; iteration < result.orbitLength; iteration += 1) {
    const offset = iteration * result.texelsPerIteration * 4;
    const real = result.values[offset]! + result.values[offset + 2]!;
    const imaginary = result.values[offset + 1]! + result.values[offset + 3]!;
    const magnitudeSquared = real * real + imaginary * imaginary;
    maximumMagnitudeSquared = Math.max(maximumMagnitudeSquared, magnitudeSquared);
    minimumMagnitudeSquared = Math.min(minimumMagnitudeSquared, magnitudeSquared);
  }

  return {
    maximumMagnitudeSquared,
    minimumMagnitudeSquared,
  };
}

function isBetterReference(
  candidate: ReferenceOrbitResult,
  current: ReferenceOrbitResult | undefined,
  backend: ReferenceOrbitRequest["backend"],
): boolean {
  if (!current || candidate.orbitLength !== current.orbitLength) {
    return !current || candidate.orbitLength > current.orbitLength;
  }
  if (backend !== "nova-cubic-perturbation") {
    return false;
  }

  const candidateConditioning = referenceConditioning(candidate);
  const currentConditioning = referenceConditioning(current);
  if (
    candidateConditioning.minimumMagnitudeSquared !== currentConditioning.minimumMagnitudeSquared
  ) {
    return (
      candidateConditioning.minimumMagnitudeSquared > currentConditioning.minimumMagnitudeSquared
    );
  }
  return (
    candidateConditioning.maximumMagnitudeSquared < currentConditioning.maximumMagnitudeSquared
  );
}

/**
 * A rapidly escaping reference orbit is both less stable and much shorter.
 * Sampling the visible area keeps perturbation quality tied to world
 * coordinates instead of the point that happens to be at screen center.
 */
export function calculateBestReferenceOrbit(request: ReferenceOrbitRequest): ReferenceOrbitResult {
  const maximumOrbitLength =
    Math.max(1, Math.min(MAX_REFERENCE_ITERATIONS, Math.trunc(request.maxIterations))) + 1;
  const candidates = referenceCandidates(request);
  let bestResult: ReferenceOrbitResult | undefined;
  let candidateCount = 0;
  let orderedCandidates = candidates;

  for (let index = 0; index < orderedCandidates.length; index += 1) {
    const candidate = orderedCandidates[index]!;
    const result = calculateReferenceOrbit({ ...request, center: candidate.center });
    candidateCount += 1;

    if (isBetterReference(result, bestResult, request.backend)) {
      bestResult = result;
    }
    if (
      index === 0 &&
      request.backend === "nova-cubic-perturbation" &&
      result.orbitLength === maximumOrbitLength
    ) {
      orderedCandidates = [
        candidate,
        ...rankNovaCandidates(result, candidates.slice(1), request.parameters),
      ];
    }
    if (
      request.backend !== "nova-cubic-perturbation" &&
      result.orbitLength === maximumOrbitLength
    ) {
      return { ...result, candidateCount };
    }
    if (
      request.backend === "nova-cubic-perturbation" &&
      result.orbitLength === maximumOrbitLength &&
      referenceConditioning(result).minimumMagnitudeSquared >=
        NOVA_EARLY_EXIT_MINIMUM_MAGNITUDE_SQUARED
    ) {
      return { ...result, candidateCount };
    }
  }

  return { ...bestResult!, candidateCount };
}
