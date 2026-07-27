import { describe, expect, it } from "vite-plus/test";
import {
  createCameraFromMagnification,
  createSerializedCamera,
  decimalDifferenceToNumber,
  magnificationForScale,
  parseCoordinateLine,
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

  it("supports a formula-specific minimum scale", () => {
    const camera = {
      center: ["-0.743643887037151", "0.13182590420533"],
      scale: "6.2e-35",
    } as const;
    const transformed = transformCamera(camera, [0.2, -0.1], [0.2, -0.1], 0.01, "3.1e-35");

    expect(Number(transformed.scale)).toBe(3.1e-35);
    expect(
      decimalDifferenceToNumber(transformed.center[0], camera.center[0], transformed.scale),
    ).toBeCloseTo(6.2e-36, 45);
    expect(
      decimalDifferenceToNumber(transformed.center[1], camera.center[1], transformed.scale),
    ).toBeCloseTo(-3.1e-36, 45);
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

  it("converts exact magnification to camera scale and back", () => {
    const camera = createCameraFromMagnification(
      ["-0.743643887037151", "0.13182590420533"],
      "1000000000000000000000000000000",
      3.1,
    );

    expect(camera.center).toEqual(["-0.743643887037151", "0.13182590420533"]);
    expect(camera.scale).toBe("0.0000000000000000000000000000031");
    expect(magnificationForScale(3.1, camera.scale)).toBe("1e+30");
  });

  it("rejects invalid exact camera values", () => {
    expect(() => createCameraFromMagnification(["0", "0"], "0", 3.1)).toThrow(
      "Масштаб должен быть положительным",
    );
    expect(() => createCameraFromMagnification(["Infinity", "0"], "1", 3.1)).toThrow(
      "Координаты должны быть конечными",
    );
  });

  it("parses the same coordinate line format used for copying", () => {
    expect(parseCoordinateLine(" -0.743643887037151, 0.13182590420533, 1e+30 ")).toEqual([
      "-0.743643887037151",
      "0.13182590420533",
      "1e+30",
    ]);
  });

  it("rejects incomplete coordinate lines", () => {
    expect(() => parseCoordinateLine("-0.75, 0.1")).toThrow(
      "действительную часть, мнимую часть и увеличение",
    );
    expect(() => parseCoordinateLine("-0.75, , 1000")).toThrow(
      "действительную часть, мнимую часть и увеличение",
    );
  });
});
