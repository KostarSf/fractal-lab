import { describe, expect, it } from "vite-plus/test";
import {
  createSerializedCamera,
  decimalDifferenceToNumber,
  precisionForScale,
  shouldUseDeepZoom,
  transformCamera,
  translateCamera,
} from "./high-precision.ts";

describe("high precision camera", () => {
  it("preserves offsets that are smaller than a JavaScript number ulp", () => {
    const camera = {
      center: ["-0.743643887037151", "0.13182590420533"],
      scale: "1e-30",
    } as const;

    const moved = translateCamera(camera, [0.125, -0.25]);

    expect(moved.center[0]).toBe("-0.743643887037150999999999999999875");
    expect(moved.center[1]).toBe("0.13182590420532999999999999999975");
  });

  it("keeps an anchor fixed while zooming", () => {
    const camera = createSerializedCamera([-0.65, 0], 3.1);
    const transformed = transformCamera(camera, [0.2, -0.1], [0.2, -0.1], 0.5);

    expect(transformed.center).toEqual(["-0.34", "-0.155"]);
    expect(transformed.scale).toBe("1.55");
  });

  it("calculates tiny deltas relative to a reference center", () => {
    expect(
      decimalDifferenceToNumber(
        "-0.743643887037150999999999999999875",
        "-0.743643887037151",
        "1e-30",
      ),
    ).toBeCloseTo(1.25e-31, 40);
  });

  it("increases guard precision with zoom depth", () => {
    expect(precisionForScale("1e-30")).toBeGreaterThanOrEqual(70);
  });

  it("enables deep zoom at 10,000× magnification", () => {
    expect(shouldUseDeepZoom(9_999.999)).toBe(false);
    expect(shouldUseDeepZoom(10_000)).toBe(true);
    expect(shouldUseDeepZoom(1_000_000)).toBe(true);
  });
});
