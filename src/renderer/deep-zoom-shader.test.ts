import { describe, expect, it } from "vite-plus/test";
import { DEEP_ZOOM_BACKEND_IDS } from "../deep-zoom/registry.ts";
import { createDeepZoomFragmentShader, deepZoomTexelsPerIteration } from "./deep-zoom-shader.ts";

describe("deep zoom shader registry", () => {
  it("generates a complete shader for every registered backend", () => {
    for (const backend of DEEP_ZOOM_BACKEND_IDS) {
      const shader = createDeepZoomFragmentShader(backend);
      const isRootBasin =
        backend === "newton-cubic-perturbation" || backend === "nova-cubic-perturbation";
      expect(shader).toContain("#version 300 es");
      expect(shader).toContain("if (u_smoothColors)");
      expect(deepZoomTexelsPerIteration(backend)).toBeGreaterThanOrEqual(1);
      expect(shader).not.toContain("forceRebase");
      if (backend === "newton-cubic-perturbation") {
        expect(shader).toContain("normalizeExtendedDelta(");
        expect(shader).toContain("calculateNextNewtonDelta(");
        expect(shader).not.toContain("referenceExhausted");
      } else if (backend === "nova-cubic-perturbation") {
        expect(shader).toContain("if (referenceExhausted || closerToCriticalPoint)");
        expect(shader).toContain("maxNorm(materializePreciseComplex(nextDeltaCurrentPrecise))");
      } else {
        expect(shader).toContain("if (referenceExhausted || closerToCriticalPoint)");
        expect(shader).toContain("maxNorm(actualZ) < maxNorm(");
      }
      if (isRootBasin) {
        expect(shader).toContain("ivec2(0, index)");
        expect(shader).toContain("int resultKind = 0;");
        expect(shader).not.toContain("postEscapeIterations");
      } else {
        expect(shader).toContain("ivec2(component, index)");
        expect(shader).toContain("int postEscapeIterations = 0;");
        expect(shader).toContain("float(postEscapeIterations)");
      }
    }
  });

  it("includes formula-specific recurrence code", () => {
    expect(createDeepZoomFragmentShader("julia-perturbation")).toContain(
      "uniform vec2 u_juliaConstant;",
    );
    expect(createDeepZoomFragmentShader("tricorn-perturbation")).toContain(
      "vec2 conjugatedDelta = complexConjugate(deltaCurrent);",
    );
    const burningShip = createDeepZoomFragmentShader("burning-ship-perturbation");
    expect(burningShip).toContain("vec2 transformedDelta = absolutePerturbationDelta(");
    expect(burningShip).not.toContain("abs(actualCurrent) - transformedReference");
    expect(burningShip).not.toContain("crossesSignBoundary");

    const phoenix = createDeepZoomFragmentShader("phoenix-perturbation");
    expect(phoenix).toContain("uniform float u_phoenixMemory;");
    expect(phoenix).toContain("fetchReference(referenceIndex, 1)");
    expect(phoenix).toContain(
      "deltaPrevious = subtractReference(actualPreviousZ, referenceStartPrevious);",
    );

    const newton = createDeepZoomFragmentShader("newton-cubic-perturbation");
    expect(newton).toContain("const float INITIAL_DELTA_EXPONENT = -96.0;");
    expect(newton).toContain("u_scale * INITIAL_DELTA_SCALE");
    expect(newton).toContain("calculateNextNewtonDelta(");
    expect(newton).toContain("useDirectExtendedOrbit");
    expect(newton).toContain("iterateExtendedNewton(");
    expect(newton).toContain("if (currentExponent > 10.0)");
    expect(newton).toContain("nextMantissa = complexMultiply(deltaMantissa, factor);");
    expect(newton).toContain("divideExtendedBy(reciprocalMantissa, reciprocalExponent, reference)");
    expect(newton).toContain("addExtendedValues(");
    expect(newton).toContain("min(referenceScale, actualScale) >= 1e-3");
    expect(newton).toContain("max(referenceScale, actualScale) <= 1e3");
    expect(newton).toContain("divideFastOrStableInPlace(reciprocalTerm, reference)");
    expect(newton).toContain("if (!calculateNewtonCorrection(actualCurrent, correction))");
    expect(newton).toContain("correction = (value - reciprocalSquared) / 3.0;");
    expect(newton).not.toContain("derivativeSquared < 1e-20");
    expect(newton).toContain("if (exponent < -120.0)");
    expect(newton).not.toContain("subtractReference(actualZ, fetchReference(0))");
    expect(newton).toContain("quadraticConvergencePhase(");

    const nova = createDeepZoomFragmentShader("nova-cubic-perturbation");
    expect(nova).toContain("uniform float u_novaRelaxation;");
    expect(nova).toContain("vec2 preciseScalarMultiply(");
    expect(nova).toContain("bool calculatePreciseCorrectionDelta(");
    expect(nova).toContain("preciseComplexScale(\n          correctionDeltaPrecise");
    expect(nova).toContain("vec4 planeDeltaPrecise = preciseComplex(planeDelta);");
    expect(nova).toContain("preciseComplexSubtract(\n        actualZPrecise");
    expect(nova).not.toContain("vec2 deltaCurrent = vec2(0.0);");
    expect(nova).toContain("thresholdCrossingPhase(previousMetric, finalMetric");
  });
});
