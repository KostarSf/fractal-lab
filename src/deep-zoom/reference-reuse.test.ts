import { describe, expect, it } from "vite-plus/test";
import type { ReferenceOrbitResult } from "./types.ts";
import {
  canAcceptCalculatedReferenceOrbit,
  canReuseReferenceOrbit,
  canReuseReferenceRequest,
  type ReferenceViewport,
} from "./reference-reuse.ts";

const SOURCE = {
  backend: "nova-cubic-perturbation",
  parameterSignature: "nova-cubic-perturbation|relaxation:1",
  center: ["-0.56", "0.46"],
  scale: "3e-20",
  maxIterations: 500,
  viewportAspect: 1.5,
} as const satisfies ReferenceViewport;

const REFERENCE = {
  requestId: 1,
  backend: SOURCE.backend,
  center: SOURCE.center,
  scale: SOURCE.scale,
  precisionDigits: 60,
  orbitLength: 501,
  texelsPerIteration: 1,
  values: new Float32Array(),
  candidateCount: 1,
} as const satisfies ReferenceOrbitResult;

describe("deep-zoom reference reuse", () => {
  it("reuses a full orbit for a pure zoom and a lower iteration budget", () => {
    expect(
      canReuseReferenceOrbit(REFERENCE, SOURCE, {
        ...SOURCE,
        scale: "1.5e-20",
        maxIterations: 420,
      }),
    ).toBe(true);
  });

  it("requires a new orbit when the existing orbit is too short", () => {
    expect(
      canReuseReferenceOrbit(REFERENCE, SOURCE, {
        ...SOURCE,
        maxIterations: 501,
      }),
    ).toBe(false);
  });

  it("accepts a freshly calculated short escape-time orbit", () => {
    const source = {
      ...SOURCE,
      backend: "mandelbrot-perturbation",
      parameterSignature: "mandelbrot-perturbation|",
    } as const satisfies ReferenceViewport;
    const reference = {
      ...REFERENCE,
      backend: source.backend,
      orbitLength: 158,
    } as const satisfies ReferenceOrbitResult;

    expect(canAcceptCalculatedReferenceOrbit(reference, source, source)).toBe(true);
    expect(canReuseReferenceOrbit(reference, source, source)).toBe(false);
  });

  it("keeps a small pan inside the sampled viewport support", () => {
    expect(
      canReuseReferenceRequest(SOURCE, {
        ...SOURCE,
        center: ["-0.5599999999999999999992", "0.4600000000000000000008"],
      }),
    ).toBe(true);
  });

  it("rejects a pan or zoom-out that leaves the sampled viewport support", () => {
    expect(
      canReuseReferenceRequest(SOURCE, {
        ...SOURCE,
        center: ["-0.559999999999999999995", "0.460000000000000000005"],
      }),
    ).toBe(false);
    expect(
      canReuseReferenceRequest(SOURCE, {
        ...SOURCE,
        scale: "3.3e-20",
      }),
    ).toBe(false);
  });

  it("does not reuse across orbit parameters or a deeper precision decade", () => {
    expect(
      canReuseReferenceRequest(SOURCE, {
        ...SOURCE,
        parameterSignature: "nova-cubic-perturbation|relaxation:0.5",
      }),
    ).toBe(false);
    expect(
      canReuseReferenceOrbit(REFERENCE, SOURCE, {
        ...SOURCE,
        scale: "1e-21",
      }),
    ).toBe(false);
  });
});
