export const ESCAPE_SMOOTHING_ITERATIONS = 4;

export function smoothEscapeIteration(
  iteration: number,
  magnitude: number,
  escapePower: number,
  postEscapeIterations = 0,
): number {
  const safeMagnitude = Math.max(magnitude, 1.000001);
  const safePower = Math.max(escapePower, 1.000001);
  const smoothing = Math.log(Math.max(Math.log(safeMagnitude) / Math.log(2), 0.000001));

  return iteration + 1 + postEscapeIterations - smoothing / Math.log(safePower);
}

export function thresholdCrossingPhase(
  previousMetric: number,
  currentMetric: number,
  threshold: number,
): number {
  if (
    !Number.isFinite(previousMetric) ||
    !Number.isFinite(currentMetric) ||
    !Number.isFinite(threshold) ||
    previousMetric <= 0 ||
    currentMetric <= 0 ||
    threshold <= 0
  ) {
    return 1;
  }

  const previousLog = Math.log(previousMetric);
  const currentLog = Math.log(currentMetric);
  const denominator = currentLog - previousLog;
  if (Math.abs(denominator) < 1e-12) {
    return 1;
  }

  return Math.min(1, Math.max(0, (Math.log(threshold) - previousLog) / denominator));
}

export function quadraticConvergencePhase(
  currentMetric: number,
  threshold: number,
  refinementSteps = 0,
): number {
  if (currentMetric === 0) {
    return 0;
  }
  if (
    !Number.isFinite(currentMetric) ||
    !Number.isFinite(threshold) ||
    currentMetric < 0 ||
    currentMetric >= 1 ||
    threshold <= 0 ||
    threshold >= 1
  ) {
    return 1;
  }

  const metricLog = -Math.log(currentMetric);
  const thresholdLog = -Math.log(threshold);
  const safeRefinementSteps = Math.max(0, Math.trunc(refinementSteps));
  const phase = 1 + safeRefinementSteps - Math.log(metricLog / thresholdLog) / Math.log(2);

  return Math.min(1, Math.max(0, phase));
}
