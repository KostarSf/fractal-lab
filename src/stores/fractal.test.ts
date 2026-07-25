import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { useFractalStore } from "./fractal.ts";

describe("fractal store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
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

    store.setCamera([1, -1], 1e-20);
    expect(store.scale).toBe(1e-12);

    store.zoomFromCenter(1e20);
    expect(store.scale).toBe(8);
  });

  it("updates parameters immutably", () => {
    const store = useFractalStore();
    store.selectFormula("julia");
    const previous = store.parameterValues;

    store.setParameter("constant", [-0.4, 0.6]);

    expect(store.parameterValues).not.toBe(previous);
    expect(store.parameterValues.constant).toEqual([-0.4, 0.6]);
  });
});
