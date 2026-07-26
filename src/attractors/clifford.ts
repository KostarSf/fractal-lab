import type { CliffordTrajectoryRequest, CliffordTrajectoryResult } from "./types.ts";

export const MIN_CLIFFORD_POINTS = 1_000;
export const MAX_CLIFFORD_POINTS = 2_000_000;
const MAX_BURN_IN = 100_000;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function calculateCliffordTrajectory(
  request: CliffordTrajectoryRequest,
): CliffordTrajectoryResult {
  const a = finiteOr(request.a, -1.4);
  const b = finiteOr(request.b, 1.6);
  const c = finiteOr(request.c, 1);
  const d = finiteOr(request.d, 0.7);
  const burnIn = Math.max(0, Math.min(MAX_BURN_IN, Math.trunc(request.burnIn)));
  const pointCount = Math.max(
    MIN_CLIFFORD_POINTS,
    Math.min(MAX_CLIFFORD_POINTS, Math.trunc(request.pointCount)),
  );
  const values = new Float32Array(pointCount * 2);

  let x = 0.1;
  let y = 0.1;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let iteration = 0; iteration < burnIn + pointCount; iteration += 1) {
    const nextX = Math.sin(a * y) + c * Math.cos(a * x);
    const nextY = Math.sin(b * x) + d * Math.cos(b * y);
    x = nextX;
    y = nextY;

    if (iteration < burnIn) {
      continue;
    }

    const index = iteration - burnIn;
    const offset = index * 2;
    values[offset] = x;
    values[offset + 1] = y;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    requestId: request.requestId,
    pointCount,
    values,
    bounds: [minX, minY, maxX, maxY],
  };
}
