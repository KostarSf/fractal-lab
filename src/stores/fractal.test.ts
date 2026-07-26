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
    expect(store.scale).toBe(1e-35);
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

  it("clamps numeric formula parameters to their declared range", () => {
    const store = useFractalStore();
    store.selectFormula("clifford");

    store.setParameter("pointCount", 10_000_000);
    store.setParameter("exposure", -1);

    expect(store.parameterValues.pointCount).toBe(2_000_000);
    expect(store.parameterValues.exposure).toBe(0.005);
  });
});
