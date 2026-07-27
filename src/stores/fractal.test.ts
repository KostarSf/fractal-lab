import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { useFractalStore } from "./fractal.ts";

describe("fractal store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("enables smooth colors by default", () => {
    expect(useFractalStore().smoothColors).toBe(true);
  });

  it("resets settings without changing the current view", () => {
    const store = useFractalStore();
    store.selectFormula("julia");
    store.setCamera([0.25, -0.5], 0.75);
    const camera = {
      center: [...store.exactCenter],
      scale: store.exactScale,
    };

    store.maxIterations = 120;
    store.palette = 3;
    store.colorDensity = 0.2;
    store.colorOffset = 0.6;
    store.smoothColors = false;
    store.setParameter("constant", [-0.4, 0.6]);

    store.resetSettings();

    expect(store.exactCenter).toEqual(camera.center);
    expect(store.exactScale).toBe(camera.scale);
    expect(store.maxIterations).toBe(360);
    expect(store.palette).toBe(0);
    expect(store.colorDensity).toBe(0.075);
    expect(store.colorOffset).toBe(0);
    expect(store.smoothColors).toBe(true);
    expect(store.parameterValues.constant).toEqual([-0.745, 0.113]);

    store.selectFormula("sierpinski-carpet");
    store.recursionDepthMode = "manual";
    store.recursionDepth = 3;
    store.geometricColoring = "solid";

    store.resetSettings();

    expect(store.recursionDepthMode).toBe("auto");
    expect(store.recursionDepth).toBe(7);
    expect(store.geometricColoring).toBe("level");
  });

  it("resets the view without changing settings", () => {
    const store = useFractalStore();
    store.setCamera([0.25, -0.5], 0.75);
    store.palette = 3;
    store.colorOffset = 0.6;

    store.resetCamera();

    expect(store.exactCenter).toEqual(["-0.65", "0"]);
    expect(store.exactScale).toBe("3.1");
    expect(store.palette).toBe(3);
    expect(store.colorOffset).toBe(0.6);
  });

  it("switches formulas and restores their defaults", () => {
    const store = useFractalStore();

    store.selectFormula("julia");

    expect(store.activeFormula.id).toBe("julia");
    expect(store.center).toEqual([0, 0]);
    expect(store.parameterValues.constant).toEqual([-0.745, 0.113]);
    expect(store.maxIterations).toBe(360);
  });

  it("keeps camera scale inside the renderer limits", () => {
    const store = useFractalStore();

    store.setCamera([1, -1], 1e-100);
    expect(store.scale).toBe(3.1e-35);
    expect(store.magnification).toBe(1e35);

    store.zoomFromCenter(0.1);
    expect(store.scale).toBe(3.1e-35);
    expect(store.magnification).toBe(1e35);

    store.setCamera([1, -1], 7);
    store.zoomFromCenter(2);
    expect(store.scale).toBe(8);

    store.selectFormula("julia");
    store.setCamera([1, -1], 1e-100);
    expect(store.scale).toBe(3.2000000000000003e-35);
    expect(store.magnification).toBe(1e35);

    store.selectFormula("newton");
    store.setCamera([1, -1], 1e-100);
    expect(store.scale).toBe(4e-35);
    expect(store.magnification).toBe(1e35);

    store.selectFormula("nova");
    store.setCamera([1, -1], 1e-100);
    expect(store.scale).toBeCloseTo(3.6e-35, 14);
    expect(store.magnification).toBe(1e35);
  });

  it("updates parameters immutably", () => {
    const store = useFractalStore();
    store.selectFormula("julia");
    const previous = store.parameterValues;

    store.setParameter("constant", [-0.4, 0.6]);

    expect(store.parameterValues).not.toBe(previous);
    expect(store.parameterValues.constant).toEqual([-0.4, 0.6]);
  });

  it("restores root-basin and point-attractor defaults", () => {
    const store = useFractalStore();

    store.selectFormula("newton");
    expect(store.activeFormula.renderer).toBe("root-basin");
    expect(store.maxIterations).toBe(80);
    expect(store.parameterValues.tolerance).toBe(0.00001);

    store.selectFormula("clifford");
    expect(store.activeFormula.renderer).toBe("point-attractor");
    expect(store.parameterValues).toMatchObject({
      a: -1.4,
      b: 1.6,
      c: 1,
      d: 0.7,
      pointCount: 500000,
    });
  });

  it("keeps geometric recursion separate from escape-time iterations", () => {
    const store = useFractalStore();

    store.selectFormula("sierpinski-carpet");

    expect(store.activeFormula.renderer).toBe("geometric-ifs");
    expect(store.recursionDepthMode).toBe("auto");
    expect(store.recursionDepth).toBe(7);
    expect(store.geometricColoring).toBe("level");
    expect(store.maxIterations).toBe(1);

    store.setRecursionDepth(100);
    expect(store.recursionDepth).toBe(15);
  });

  it("limits geometric zoom to the registered shader depth", () => {
    const store = useFractalStore();
    store.selectFormula("sierpinski-carpet");

    store.setCamera([0, 0], 1e-30);

    expect(store.magnification).toBeCloseTo(3 ** 15, 6);
  });

  it("clamps numeric formula parameters to their declared range", () => {
    const store = useFractalStore();
    store.selectFormula("clifford");

    store.setParameter("pointCount", 10_000_000);
    store.setParameter("exposure", -1);

    expect(store.parameterValues.pointCount).toBe(2_000_000);
    expect(store.parameterValues.exposure).toBe(0.005);
  });
});
