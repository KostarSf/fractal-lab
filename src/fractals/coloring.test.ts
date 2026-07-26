import { describe, expect, it } from "vite-plus/test";
import {
  ESCAPE_SMOOTHING_ITERATIONS,
  quadraticConvergencePhase,
  smoothEscapeIteration,
  thresholdCrossingPhase,
} from "./coloring.ts";

function mandelbrotEscape(realC: number, postEscapeIterations: number) {
  let z = 0;
  let iteration = -1;

  for (let index = 0; index < 200; index += 1) {
    z = z * z + realC;
    if (z * z > 4) {
      iteration = index;
      break;
    }
  }

  for (let index = 0; index < postEscapeIterations; index += 1) {
    z = z * z + realC;
  }

  return {
    iteration,
    smoothIteration: smoothEscapeIteration(iteration, Math.abs(z), 2, postEscapeIterations),
  };
}

describe("continuous iteration coloring", () => {
  it("keeps the escape value invariant under pure-power post-escape steps", () => {
    const escapedMagnitude = 2.5;
    const postEscapeMagnitude = escapedMagnitude ** (2 ** ESCAPE_SMOOTHING_ITERATIONS);

    expect(
      smoothEscapeIteration(12, postEscapeMagnitude, 2, ESCAPE_SMOOTHING_ITERATIONS),
    ).toBeCloseTo(smoothEscapeIteration(12, escapedMagnitude, 2), 12);
  });

  it("removes the residual jump at a Mandelbrot escape-band boundary", () => {
    let slowerSide = 0.306;
    let fasterSide = 0.307;
    const slowerIteration = mandelbrotEscape(slowerSide, 0).iteration;

    for (let index = 0; index < 60; index += 1) {
      const midpoint = (slowerSide + fasterSide) * 0.5;
      if (mandelbrotEscape(midpoint, 0).iteration === slowerIteration) {
        slowerSide = midpoint;
      } else {
        fasterSide = midpoint;
      }
    }

    const epsilon = 1e-13;
    const immediateGap = Math.abs(
      mandelbrotEscape(slowerSide - epsilon, 0).smoothIteration -
        mandelbrotEscape(fasterSide + epsilon, 0).smoothIteration,
    );
    const refinedGap = Math.abs(
      mandelbrotEscape(slowerSide - epsilon, ESCAPE_SMOOTHING_ITERATIONS).smoothIteration -
        mandelbrotEscape(fasterSide + epsilon, ESCAPE_SMOOTHING_ITERATIONS).smoothIteration,
    );

    expect(immediateGap).toBeGreaterThan(0.05);
    expect(refinedGap).toBeLessThan(1e-8);
  });

  it("interpolates both ends of a decreasing threshold crossing", () => {
    expect(thresholdCrossingPhase(1e-5, 1e-10, 1e-5)).toBe(0);
    expect(thresholdCrossingPhase(1e-2, 1e-5, 1e-5)).toBe(1);
    expect(thresholdCrossingPhase(1e-2, 1e-8, 1e-5)).toBeCloseTo(0.5, 12);
  });

  it("interpolates an increasing escape-radius crossing", () => {
    expect(thresholdCrossingPhase(8, 128, 32)).toBeCloseTo(0.5, 12);
  });

  it("uses a stable fallback for invalid or flat metrics", () => {
    expect(thresholdCrossingPhase(1, 1, 0.5)).toBe(1);
    expect(thresholdCrossingPhase(Number.NaN, 1, 0.5)).toBe(1);
  });

  it("normalizes a quadratically converging Newton metric", () => {
    const threshold = 1e-5;

    expect(quadraticConvergencePhase(threshold, threshold)).toBeCloseTo(1, 12);
    expect(quadraticConvergencePhase(threshold ** 2, threshold)).toBeCloseTo(0, 12);
    expect(quadraticConvergencePhase(threshold ** Math.sqrt(2), threshold)).toBeCloseTo(0.5, 12);
  });

  it("matches the Newton color slope across an iteration boundary", () => {
    const threshold = 1e-5;
    const epsilon = 1e-6;
    const band = 10;
    const boundaryColor = band + quadraticConvergencePhase(threshold, threshold);
    const fasterColor = band + quadraticConvergencePhase(threshold * (1 - epsilon), threshold);
    const slowerBoundaryColor = band + 1 + quadraticConvergencePhase(threshold ** 2, threshold);
    const slowerColor =
      band + 1 + quadraticConvergencePhase((threshold * (1 + epsilon)) ** 2, threshold);

    expect(slowerBoundaryColor).toBeCloseTo(boundaryColor, 12);
    expect((boundaryColor - fasterColor) / epsilon).toBeCloseTo(
      (slowerColor - slowerBoundaryColor) / epsilon,
      5,
    );
  });

  it("preserves the Newton phase after a root-local refinement step", () => {
    const threshold = 1e-5;
    const metric = threshold ** Math.sqrt(2);

    expect(quadraticConvergencePhase(metric ** 2, threshold, 1)).toBeCloseTo(
      quadraticConvergencePhase(metric, threshold),
      12,
    );
  });
});
