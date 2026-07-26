import { describe, expect, it } from "vite-plus/test";
import { createBasinFragmentShader } from "../renderer/basin-shader.ts";
import { createDefaultParameters, FRACTAL_FORMULAS } from "./formulas.ts";
import { createFragmentShader } from "./shader.ts";

describe("fractal formula registry", () => {
  it("uses unique ids and uniform names", () => {
    const ids = FRACTAL_FORMULAS.map((formula) => formula.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const formula of FRACTAL_FORMULAS) {
      const uniforms = formula.parameters.map((parameter) => parameter.uniform);
      expect(new Set(uniforms).size).toBe(uniforms.length);
    }
  });

  it("registers escape-time, root-basin and point-attractor backends", () => {
    expect(new Set(FRACTAL_FORMULAS.map((formula) => formula.renderer))).toEqual(
      new Set(["escape-time", "root-basin", "point-attractor"]),
    );
    expect(FRACTAL_FORMULAS.find((formula) => formula.id === "newton")).toMatchObject({
      renderer: "root-basin",
      basinBackend: "newton-cubic",
    });
    expect(FRACTAL_FORMULAS.find((formula) => formula.id === "nova")).toMatchObject({
      renderer: "root-basin",
      basinBackend: "nova-cubic",
    });
    expect(FRACTAL_FORMULAS.find((formula) => formula.id === "clifford")).toMatchObject({
      renderer: "point-attractor",
      attractorBackend: "clifford",
    });
    expect(FRACTAL_FORMULAS.find((formula) => formula.id === "mandelbrot")).toMatchObject({
      deepZoom: {
        backend: "mandelbrot-perturbation",
        maxMagnification: 1e35,
      },
    });
    expect(
      FRACTAL_FORMULAS.filter((formula) => formula.renderer === "escape-time").map(
        (formula) => formula.deepZoom?.backend,
      ),
    ).toEqual([
      "mandelbrot-perturbation",
      "julia-perturbation",
      "burning-ship-perturbation",
      "tricorn-perturbation",
      "phoenix-perturbation",
    ]);
  });

  it("generates complete shaders for pixel-based formulas", () => {
    for (const formula of FRACTAL_FORMULAS) {
      if (formula.renderer === "point-attractor") {
        continue;
      }

      const shader =
        formula.renderer === "escape-time"
          ? createFragmentShader(formula)
          : createBasinFragmentShader(formula);

      expect(shader).toContain("#version 300 es");
      expect(shader).toContain("uniform bool u_smoothColors;");
      expect(shader).toContain("if (u_smoothColors)");

      if (formula.renderer === "escape-time") {
        expect(shader).toContain(formula.shader.setup.trim());
        expect(shader).toContain(formula.shader.iterate.trim());
        expect(shader).toContain(`if (!didEscape && ${formula.shader.escaped})`);
        expect(shader).toContain("int postEscapeIterations = 0;");
        expect(shader).toContain("float(postEscapeIterations)");
      } else {
        expect(shader).toContain(
          formula.basinBackend === "newton-cubic"
            ? "iterateNewtonLocalError(previousZ - root, root)"
            : "thresholdCrossingPhase(previousMetric, finalMetric",
        );
        if (formula.basinBackend === "newton-cubic") {
          expect(shader).toContain("convergenceRefinementSteps");
          expect(shader).toContain("stableComplexMagnitude(localError)");
        }
        expect(shader).toContain("colorIteration * u_colorDensity");
        expect(shader).not.toContain("float convergence");
      }

      for (const parameter of formula.parameters) {
        const glslType = parameter.type === "complex" ? "vec2" : "float";
        expect(shader).toContain(`uniform ${glslType} ${parameter.uniform};`);
      }
    }
  });

  it("creates independent complex parameter defaults", () => {
    const julia = FRACTAL_FORMULAS.find((formula) => formula.id === "julia");
    expect(julia).toBeDefined();

    const firstDefaults = createDefaultParameters(julia!);
    const secondDefaults = createDefaultParameters(julia!);

    expect(firstDefaults.constant).toEqual([-0.745, 0.113]);
    expect(firstDefaults.constant).not.toBe(secondDefaults.constant);
  });

  it("provides a bounded, renderable preview preset for every formula", () => {
    for (const formula of FRACTAL_FORMULAS) {
      expect(formula.preview.view.scale).toBeGreaterThan(0);
      expect(formula.preview.view.center.every(Number.isFinite)).toBe(true);
      expect(formula.preview.palette ?? 0).toBeGreaterThanOrEqual(0);
      expect(formula.preview.palette ?? 0).toBeLessThanOrEqual(3);

      for (const key of Object.keys(formula.preview.parameters ?? {})) {
        expect(formula.parameters.some((parameter) => parameter.key === key)).toBe(true);
      }
    }

    const clifford = FRACTAL_FORMULAS.find((formula) => formula.id === "clifford");
    expect(clifford?.preview.parameters?.pointCount).toBeLessThan(500000);
  });
});
