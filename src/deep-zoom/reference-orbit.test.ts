import { describe, expect, it } from "vite-plus/test";
import type { ReferenceOrbitResult } from "./types.ts";
import { calculateBestReferenceOrbit, calculateReferenceOrbit } from "./reference-orbit.ts";

function orbitPoint(
  result: ReferenceOrbitResult,
  index: number,
  component = 0,
): readonly [number, number] {
  const offset = (index * result.texelsPerIteration + component) * 4;
  return [
    result.values[offset]! + result.values[offset + 2]!,
    result.values[offset + 1]! + result.values[offset + 3]!,
  ];
}

describe("reference orbit", () => {
  it("calculates the known orbit for c = -1", () => {
    const result = calculateReferenceOrbit({
      requestId: 1,
      backend: "mandelbrot-perturbation",
      parameters: {},
      center: ["-1", "0"],
      scale: "1e-30",
      maxIterations: 4,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 0)).toEqual([0, 0]);
    expect(orbitPoint(result, 1)).toEqual([-1, 0]);
    expect(orbitPoint(result, 2)).toEqual([0, 0]);
    expect(orbitPoint(result, 3)).toEqual([-1, 0]);
    expect(result.precisionDigits).toBeGreaterThanOrEqual(70);
  });

  it("stores a high/low split for reference coordinates", () => {
    const result = calculateReferenceOrbit({
      requestId: 2,
      backend: "mandelbrot-perturbation",
      parameters: {},
      center: ["-0.743643887037151", "0.13182590420533"],
      scale: "1e-30",
      maxIterations: 2,
      viewportAspect: 1,
    });

    const firstIteration = orbitPoint(result, 1);
    expect(firstIteration[0]).toBeCloseTo(-0.743643887037151, 14);
    expect(firstIteration[1]).toBeCloseTo(0.13182590420533, 14);
    expect(result.values[6]).not.toBe(0);
  });

  it("selects a longer-lived reference orbit from the visible area", () => {
    const result = calculateBestReferenceOrbit({
      requestId: 3,
      backend: "mandelbrot-perturbation",
      parameters: {},
      center: ["0.5", "0"],
      scale: "2",
      maxIterations: 50,
      viewportAspect: 1,
    });

    expect(result.center).not.toEqual(["0.5", "0"]);
    expect(result.orbitLength).toBe(51);
  });

  it("starts a Julia reference at the selected dynamic-plane point", () => {
    const result = calculateReferenceOrbit({
      requestId: 4,
      backend: "julia-perturbation",
      parameters: { constant: [0, 0] },
      center: ["0.25", "0"],
      scale: "1e-20",
      maxIterations: 3,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 0)).toEqual([0.25, 0]);
    expect(orbitPoint(result, 1)).toEqual([0.0625, 0]);
    expect(orbitPoint(result, 2)).toEqual([0.00390625, 0]);
  });

  it("applies conjugation in the Tricorn reference recurrence", () => {
    const result = calculateReferenceOrbit({
      requestId: 5,
      backend: "tricorn-perturbation",
      parameters: {},
      center: ["0", "1"],
      scale: "1e-20",
      maxIterations: 3,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 1)).toEqual([0, 1]);
    expect(orbitPoint(result, 2)).toEqual([-1, 1]);
    expect(orbitPoint(result, 3)).toEqual([0, 3]);
  });

  it("applies the absolute-value transform in the Burning Ship reference", () => {
    const result = calculateReferenceOrbit({
      requestId: 6,
      backend: "burning-ship-perturbation",
      parameters: {},
      center: ["-0.5", "-0.5"],
      scale: "1e-20",
      maxIterations: 2,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 1)).toEqual([-0.5, -0.5]);
    expect(orbitPoint(result, 2)).toEqual([-0.5, 0]);
  });

  it("packs current and previous Phoenix states into adjacent texels", () => {
    const result = calculateReferenceOrbit({
      requestId: 7,
      backend: "phoenix-perturbation",
      parameters: { constant: [0.5, 0], memory: -0.5 },
      center: ["0.2", "0"],
      scale: "1e-20",
      maxIterations: 2,
      viewportAspect: 1,
    });

    expect(result.texelsPerIteration).toBe(2);
    expect(orbitPoint(result, 0, 0)[0]).toBeCloseTo(0.2, 14);
    expect(orbitPoint(result, 0, 1)).toEqual([0, 0]);
    expect(orbitPoint(result, 1, 0)[0]).toBeCloseTo(0.54, 14);
    expect(orbitPoint(result, 1, 1)[0]).toBeCloseTo(0.2, 14);
    expect(orbitPoint(result, 2, 0)[0]).toBeCloseTo(0.6916, 14);
  });
});
