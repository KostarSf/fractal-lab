import type { ComplexValue } from "./types.ts";

export type BasinPointResult =
  | {
      readonly kind: "converged";
      readonly iterations: number;
      readonly value: ComplexValue;
      readonly rootIndex: number;
    }
  | {
      readonly kind: "escaped" | "unresolved";
      readonly iterations: number;
      readonly value: ComplexValue;
    };

const CUBIC_ROOTS = [
  [1, 0],
  [-0.5, Math.sqrt(3) * 0.5],
  [-0.5, -Math.sqrt(3) * 0.5],
] as const;

function square([real, imaginary]: ComplexValue): ComplexValue {
  return [real * real - imaginary * imaginary, 2 * real * imaginary];
}

function multiply(
  [leftReal, leftImaginary]: ComplexValue,
  [rightReal, rightImaginary]: ComplexValue,
): ComplexValue {
  return [
    leftReal * rightReal - leftImaginary * rightImaginary,
    leftReal * rightImaginary + leftImaginary * rightReal,
  ];
}

function divide(
  [numeratorReal, numeratorImaginary]: ComplexValue,
  [denominatorReal, denominatorImaginary]: ComplexValue,
): ComplexValue | undefined {
  const denominator =
    denominatorReal * denominatorReal + denominatorImaginary * denominatorImaginary;
  if (denominator < 1e-20) {
    return undefined;
  }
  return [
    (numeratorReal * denominatorReal + numeratorImaginary * denominatorImaginary) / denominator,
    (numeratorImaginary * denominatorReal - numeratorReal * denominatorImaginary) / denominator,
  ];
}

function cubicCorrection(value: ComplexValue): ComplexValue | undefined {
  const squared = square(value);
  const cubed = multiply(squared, value);
  return divide([cubed[0] - 1, cubed[1]], [3 * squared[0], 3 * squared[1]]);
}

function nearestCubicRoot(value: ComplexValue): number {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const [index, root] of CUBIC_ROOTS.entries()) {
    const distance = (value[0] - root[0]) ** 2 + (value[1] - root[1]) ** 2;
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  }

  return nearestIndex;
}

export function iterateNewtonPoint(
  point: ComplexValue,
  maxIterations: number,
  tolerance: number,
): BasinPointResult {
  let value: ComplexValue = point;
  const safeTolerance = Math.max(1e-12, Math.abs(tolerance));
  const limit = Math.max(1, Math.trunc(maxIterations));

  for (let iteration = 0; iteration < limit; iteration += 1) {
    const correction = cubicCorrection(value);
    if (!correction) {
      return { kind: "unresolved", iterations: iteration, value };
    }

    value = [value[0] - correction[0], value[1] - correction[1]];
    if (!Number.isFinite(value[0]) || !Number.isFinite(value[1])) {
      return { kind: "unresolved", iterations: iteration + 1, value };
    }
    if (correction[0] ** 2 + correction[1] ** 2 <= safeTolerance ** 2) {
      return {
        kind: "converged",
        iterations: iteration + 1,
        value,
        rootIndex: nearestCubicRoot(value),
      };
    }
  }

  return { kind: "unresolved", iterations: limit, value };
}

export function iterateNovaPoint(
  point: ComplexValue,
  maxIterations: number,
  relaxation: number,
  tolerance: number,
  escapeRadius: number,
): BasinPointResult {
  let value: ComplexValue = [1, 0];
  const safeTolerance = Math.max(1e-12, Math.abs(tolerance));
  const safeEscapeRadius = Math.max(2, Math.abs(escapeRadius));
  const limit = Math.max(1, Math.trunc(maxIterations));

  for (let iteration = 0; iteration < limit; iteration += 1) {
    const correction = cubicCorrection(value);
    if (!correction) {
      return { kind: "unresolved", iterations: iteration, value };
    }

    const next: ComplexValue = [
      value[0] - relaxation * correction[0] + point[0],
      value[1] - relaxation * correction[1] + point[1],
    ];
    const deltaSquared = (next[0] - value[0]) ** 2 + (next[1] - value[1]) ** 2;
    value = next;

    if (!Number.isFinite(value[0]) || !Number.isFinite(value[1])) {
      return { kind: "escaped", iterations: iteration + 1, value };
    }
    if (value[0] ** 2 + value[1] ** 2 > safeEscapeRadius ** 2) {
      return { kind: "escaped", iterations: iteration + 1, value };
    }
    if (deltaSquared <= safeTolerance ** 2) {
      return {
        kind: "converged",
        iterations: iteration + 1,
        value,
        rootIndex: nearestCubicRoot(value),
      };
    }
  }

  return { kind: "unresolved", iterations: limit, value };
}
