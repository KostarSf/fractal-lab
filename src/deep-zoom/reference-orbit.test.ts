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

function minimumOrbitMagnitude(result: ReferenceOrbitResult): number {
  let minimum = Number.POSITIVE_INFINITY;
  for (let index = 0; index < result.orbitLength; index += 1) {
    const [real, imaginary] = orbitPoint(result, index);
    minimum = Math.min(minimum, Math.hypot(real, imaginary));
  }
  return minimum;
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

  it("calculates a cubic Newton reference orbit from the plane point", () => {
    const result = calculateReferenceOrbit({
      requestId: 8,
      backend: "newton-cubic-perturbation",
      parameters: { tolerance: 1e-5 },
      center: ["2", "0"],
      scale: "1e-20",
      maxIterations: 2,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 0)).toEqual([2, 0]);
    expect(orbitPoint(result, 1)[0]).toBeCloseTo(17 / 12, 14);
    expect(orbitPoint(result, 1)[1]).toBe(0);
  });

  it("calculates a relaxed Nova reference orbit with the plane point as c", () => {
    const result = calculateReferenceOrbit({
      requestId: 9,
      backend: "nova-cubic-perturbation",
      parameters: { relaxation: 0.5, escapeRadius: 32, tolerance: 1e-5 },
      center: ["0.1", "0"],
      scale: "1e-20",
      maxIterations: 2,
      viewportAspect: 1,
    });

    expect(orbitPoint(result, 0)).toEqual([1, 0]);
    expect(orbitPoint(result, 1)[0]).toBeCloseTo(1.1, 14);
    expect(orbitPoint(result, 1)[1]).toBe(0);
    expect(orbitPoint(result, 2)[0]).toBeCloseTo(1.1544077134986226, 14);
  });

  it("avoids a poorly conditioned Nova reference near the Newton pole", () => {
    const request = {
      requestId: 10,
      backend: "nova-cubic-perturbation",
      parameters: { relaxation: 1, escapeRadius: 32, tolerance: 1e-5 },
      center: [
        "-0.5635056508978129403584865883114601384960985093031720655813935",
        "0.4604381744326210260055039469581156001484013367015524702673916",
      ],
      scale: "3.3643029627870459853825068528251640603590769100179956804543931e-21",
      maxIterations: 500,
      viewportAspect: 1.5,
    } as const;
    const centered = calculateReferenceOrbit(request);
    const selected = calculateBestReferenceOrbit(request);

    expect(centered.orbitLength).toBe(501);
    expect(selected.orbitLength).toBe(501);
    expect(selected.center).not.toEqual(request.center);
    expect(minimumOrbitMagnitude(centered)).toBeLessThan(0.08);
    expect(minimumOrbitMagnitude(selected)).toBeGreaterThan(0.25);
  });

  it("skips a singular Newton center when selecting the viewport reference", () => {
    const result = calculateBestReferenceOrbit({
      requestId: 11,
      backend: "newton-cubic-perturbation",
      parameters: { tolerance: 1e-5 },
      center: ["0", "0"],
      scale: "1e-3",
      maxIterations: 20,
      viewportAspect: 1,
    });

    expect(result.center).not.toEqual(["0", "0"]);
    expect(result.orbitLength).toBeGreaterThan(1);
  });

  it("keeps the reported deep Newton reference finite through the iteration budget", () => {
    const result = calculateReferenceOrbit({
      requestId: 12,
      backend: "newton-cubic-perturbation",
      parameters: { tolerance: 1e-5 },
      center: ["1.261734435999730917660226160714876", "1.532704545089778066177656844939145"],
      scale: "1.8691588785046728972e-30",
      maxIterations: 235,
      viewportAspect: 1.47,
    });

    expect(result.precisionDigits).toBe(70);
    expect(result.orbitLength).toBe(236);
    expect(result.values.every(Number.isFinite)).toBe(true);
  });
});
