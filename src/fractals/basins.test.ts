import { describe, expect, it } from "vite-plus/test";
import { iterateNewtonPoint, iterateNovaPoint } from "./basins.ts";

describe("root-basin iterations", () => {
  it("classifies all three cubic Newton roots", () => {
    expect(iterateNewtonPoint([1.1, 0], 40, 1e-8)).toMatchObject({
      kind: "converged",
      rootIndex: 0,
    });
    expect(iterateNewtonPoint([-0.55, 0.9], 40, 1e-8)).toMatchObject({
      kind: "converged",
      rootIndex: 1,
    });
    expect(iterateNewtonPoint([-0.55, -0.9], 40, 1e-8)).toMatchObject({
      kind: "converged",
      rootIndex: 2,
    });
  });

  it("handles the zero derivative without producing NaN", () => {
    const result = iterateNewtonPoint([0, 0], 40, 1e-8);
    expect(result.kind).toBe("unresolved");
    expect(result.value).toEqual([0, 0]);
  });

  it("distinguishes converging and escaping Nova points", () => {
    expect(iterateNovaPoint([0, 0], 80, 1, 1e-8, 32).kind).toBe("converged");
    expect(iterateNovaPoint([8, 8], 80, 1, 1e-8, 32).kind).toBe("escaped");
  });
});
