import { describe, expect, it } from "vite-plus/test";
import { MAX_GEOMETRIC_SHADER_DEPTH, MAX_GRID_CELLS } from "../geometric-ifs/rules.ts";
import { GEOMETRIC_IFS_FRAGMENT_SHADER } from "./geometric-ifs-shader.ts";

describe("geometric IFS shader", () => {
  it("uses bounded analytic recursion and registered rule uniforms", () => {
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain(
      `for (int level = 0; level < ${MAX_GEOMETRIC_SHADER_DEPTH}; level++)`,
    );
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain(`uniform int u_gridMask[${MAX_GRID_CELLS}];`);
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain("uniform int u_recursionDepth;");
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain("if (u_ruleType == 0)");
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain("triangleCoordinates(point)");
  });

  it("fades only the last auto-depth hole at subpixel scale", () => {
    expect(GEOMETRIC_IFS_FRAGMENT_SHADER).toContain(
      "u_autoDepth ? smoothstep(0.68, 1.35, childPixels) : 1.0",
    );
  });
});
