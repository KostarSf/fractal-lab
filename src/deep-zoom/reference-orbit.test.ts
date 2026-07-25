import { describe, expect, it } from "vite-plus/test";
import { calculateBestReferenceOrbit, calculateReferenceOrbit } from "./reference-orbit.ts";

function orbitPoint(values: Float32Array, index: number): readonly [number, number] {
  const offset = index * 4;
  return [values[offset]! + values[offset + 2]!, values[offset + 1]! + values[offset + 3]!];
}

describe("reference orbit", () => {
  it("calculates the known orbit for c = -1", () => {
    const result = calculateReferenceOrbit({
      requestId: 1,
      center: ["-1", "0"],
      scale: "1e-30",
      maxIterations: 4,
      viewportAspect: 1,
    });

    expect(orbitPoint(result.values, 0)).toEqual([0, 0]);
    expect(orbitPoint(result.values, 1)).toEqual([-1, 0]);
    expect(orbitPoint(result.values, 2)).toEqual([0, 0]);
    expect(orbitPoint(result.values, 3)).toEqual([-1, 0]);
    expect(result.precisionDigits).toBeGreaterThanOrEqual(70);
  });

  it("stores a high/low split for reference coordinates", () => {
    const result = calculateReferenceOrbit({
      requestId: 2,
      center: ["-0.743643887037151", "0.13182590420533"],
      scale: "1e-30",
      maxIterations: 2,
      viewportAspect: 1,
    });

    const firstIteration = orbitPoint(result.values, 1);
    expect(firstIteration[0]).toBeCloseTo(-0.743643887037151, 14);
    expect(firstIteration[1]).toBeCloseTo(0.13182590420533, 14);
    expect(result.values[6]).not.toBe(0);
  });

  it("selects a longer-lived reference orbit from the visible area", () => {
    const result = calculateBestReferenceOrbit({
      requestId: 3,
      center: ["0.5", "0"],
      scale: "2",
      maxIterations: 50,
      viewportAspect: 1,
    });

    expect(result.center).not.toEqual(["0.5", "0"]);
    expect(result.orbitLength).toBe(51);
  });
});
