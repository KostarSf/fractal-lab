import { describe, expect, it } from "vite-plus/test";
import { GEOMETRIC_IFS_FORMULAS } from "./presets.ts";
import {
  classifyGeometricPoint,
  resolveAutoRecursionDepth,
  validateGeometricIfsRule,
} from "./rules.ts";

function rule(id: string) {
  const formula = GEOMETRIC_IFS_FORMULAS.find((candidate) => candidate.id === id);
  if (!formula) {
    throw new Error(`Unknown geometric IFS preset: ${id}`);
  }
  return formula.geometricIfs;
}

describe("geometric IFS rules", () => {
  it("validates every registered preset", () => {
    for (const formula of GEOMETRIC_IFS_FORMULAS) {
      expect(() => validateGeometricIfsRule(formula.geometricIfs)).not.toThrow();
    }
  });

  it("removes the central third of the Sierpinski carpet", () => {
    const carpet = rule("sierpinski-carpet");

    expect(classifyGeometricPoint(carpet, [0, 0], 1)).toMatchObject({
      insideBaseArea: true,
      retained: false,
      removedAtLevel: 1,
    });
    expect(classifyGeometricPoint(carpet, [-0.8, -0.8], 4).retained).toBe(true);
    expect(classifyGeometricPoint(carpet, [-2 / 3, -2 / 3], 2)).toMatchObject({
      retained: false,
      removedAtLevel: 2,
    });
  });

  it("assigns grid boundaries consistently without cracks", () => {
    const carpet = rule("sierpinski-carpet");
    const leftBoundary = classifyGeometricPoint(carpet, [-1 / 3, 0], 1);
    const rightBoundary = classifyGeometricPoint(carpet, [1 / 3, 0], 1);

    expect(leftBoundary.insideBaseArea).toBe(true);
    expect(leftBoundary.retained).toBe(false);
    expect(rightBoundary.insideBaseArea).toBe(true);
    expect(rightBoundary.retained).toBe(true);
    expect(classifyGeometricPoint(carpet, [1, 1], 8).retained).toBe(true);
    expect(classifyGeometricPoint(carpet, [1.000001, 1], 8).insideBaseArea).toBe(false);
  });

  it("keeps the expected Vicsek cells", () => {
    const corners = rule("vicsek-corners");
    const cross = rule("vicsek-cross");

    expect(classifyGeometricPoint(corners, [0, 0], 1).retained).toBe(true);
    expect(classifyGeometricPoint(corners, [0.8, 0.8], 1).retained).toBe(true);
    expect(classifyGeometricPoint(corners, [0, 0.8], 1).retained).toBe(false);

    expect(classifyGeometricPoint(cross, [0, 0], 1).retained).toBe(true);
    expect(classifyGeometricPoint(cross, [0, 0.8], 1).retained).toBe(true);
    expect(classifyGeometricPoint(cross, [0.8, 0.8], 1).retained).toBe(false);
  });

  it("uses affine corner membership for the Sierpinski triangle", () => {
    const triangle = rule("sierpinski-triangle");

    expect(classifyGeometricPoint(triangle, [0, 0], 1)).toMatchObject({
      insideBaseArea: true,
      retained: false,
      removedAtLevel: 1,
    });
    expect(classifyGeometricPoint(triangle, [0, (2 * Math.sqrt(3)) / 3], 8).retained).toBe(true);
    expect(classifyGeometricPoint(triangle, [0.9, 0.9], 1).insideBaseArea).toBe(false);
  });

  it("adds auto levels as cells become larger than physical pixels", () => {
    const carpet = rule("sierpinski-carpet");
    const initialDepth = resolveAutoRecursionDepth(2.35, 800, carpet);
    const zoomedDepth = resolveAutoRecursionDepth(2.35 / 9, 800, carpet);

    expect(initialDepth).toBeGreaterThanOrEqual(6);
    expect(zoomedDepth).toBe(initialDepth + 2);
    expect(resolveAutoRecursionDepth(1e-30, 800, carpet)).toBe(carpet.recommendedMaxDepth);
  });
});
