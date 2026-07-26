import { describe, expect, it } from "vite-plus/test";
import {
  calculateCliffordTrajectory,
  MAX_CLIFFORD_POINTS,
  MIN_CLIFFORD_POINTS,
} from "./clifford.ts";

describe("Clifford trajectory", () => {
  it("follows the Clifford recurrence", () => {
    const parameters = { a: -1.4, b: 1.6, c: 1, d: 0.7 };
    const result = calculateCliffordTrajectory({
      requestId: 1,
      ...parameters,
      burnIn: 0,
      pointCount: MIN_CLIFFORD_POINTS,
    });
    const [firstX, firstY, secondX, secondY] = result.values;

    expect(secondX).toBeCloseTo(
      Math.sin(parameters.a * firstY!) + parameters.c * Math.cos(parameters.a * firstX!),
      5,
    );
    expect(secondY).toBeCloseTo(
      Math.sin(parameters.b * firstX!) + parameters.d * Math.cos(parameters.b * firstY!),
      5,
    );
  });

  it("clamps unsafe point counts and returns finite bounds", () => {
    const minimum = calculateCliffordTrajectory({
      requestId: 2,
      a: -1.4,
      b: 1.6,
      c: 1,
      d: 0.7,
      burnIn: -10,
      pointCount: 1,
    });
    expect(minimum.pointCount).toBe(MIN_CLIFFORD_POINTS);
    expect(minimum.bounds.every(Number.isFinite)).toBe(true);

    const maximum = calculateCliffordTrajectory({
      requestId: 3,
      a: -1.4,
      b: 1.6,
      c: 1,
      d: 0.7,
      burnIn: 0,
      pointCount: Number.POSITIVE_INFINITY,
    });
    expect(maximum.pointCount).toBe(MAX_CLIFFORD_POINTS);
  });
});
