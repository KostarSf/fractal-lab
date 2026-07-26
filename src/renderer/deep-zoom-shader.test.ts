import { describe, expect, it } from "vite-plus/test";
import { DEEP_ZOOM_BACKEND_IDS } from "../deep-zoom/registry.ts";
import { createDeepZoomFragmentShader, deepZoomTexelsPerIteration } from "./deep-zoom-shader.ts";

describe("deep zoom shader registry", () => {
  it("generates a complete shader for every registered backend", () => {
    for (const backend of DEEP_ZOOM_BACKEND_IDS) {
      const shader = createDeepZoomFragmentShader(backend);
      expect(shader).toContain("#version 300 es");
      expect(shader).toContain("if (u_smoothColors)");
      expect(shader).toContain("ivec2(component, index)");
      expect(deepZoomTexelsPerIteration(backend)).toBeGreaterThanOrEqual(1);
      expect(shader).toContain("if (referenceExhausted || unstable || forceRebase)");
      expect(shader).toContain("int postEscapeIterations = 0;");
      expect(shader).toContain("float(postEscapeIterations)");
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

    const phoenix = createDeepZoomFragmentShader("phoenix-perturbation");
    expect(phoenix).toContain("uniform float u_phoenixMemory;");
    expect(phoenix).toContain("fetchReference(referenceIndex, 1)");
    expect(phoenix).toContain(
      "deltaPrevious = subtractReference(actualPreviousZ, referenceStartPrevious);",
    );
  });
});
