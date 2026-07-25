import { describe, expect, it } from "vite-plus/test";
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

  it("generates a complete fragment shader for every formula", () => {
    for (const formula of FRACTAL_FORMULAS) {
      const shader = createFragmentShader(formula);

      expect(shader).toContain("#version 300 es");
      expect(shader).toContain(formula.shader.setup.trim());
      expect(shader).toContain(formula.shader.iterate.trim());
      expect(shader).toContain(`if (${formula.shader.escaped})`);
      expect(shader).toContain("uniform bool u_smoothColors;");
      expect(shader).toContain("if (u_smoothColors)");

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
});
