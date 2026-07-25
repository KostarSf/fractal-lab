import { defineStore } from "pinia";
import { createDefaultParameters, FRACTAL_FORMULAS } from "../fractals/formulas.ts";
import type { ComplexValue, FractalParameterValue } from "../fractals/types.ts";

const DEFAULT_FORMULA = FRACTAL_FORMULAS[0]!;

interface FractalState {
  activeFormulaId: string;
  center: [number, number];
  scale: number;
  maxIterations: number;
  palette: number;
  colorDensity: number;
  colorOffset: number;
  parameterValues: Record<string, FractalParameterValue>;
}

function findFormula(id: string) {
  return FRACTAL_FORMULAS.find((formula) => formula.id === id) ?? DEFAULT_FORMULA;
}

export const useFractalStore = defineStore("fractal", {
  state: (): FractalState => ({
    activeFormulaId: DEFAULT_FORMULA.id,
    center: [...DEFAULT_FORMULA.initialView.center],
    scale: DEFAULT_FORMULA.initialView.scale,
    maxIterations: DEFAULT_FORMULA.suggestedIterations,
    palette: 0,
    colorDensity: 0.075,
    colorOffset: 0,
    parameterValues: createDefaultParameters(DEFAULT_FORMULA),
  }),

  getters: {
    activeFormula: (state) => findFormula(state.activeFormulaId),
    magnification: (state) => findFormula(state.activeFormulaId).initialView.scale / state.scale,
  },

  actions: {
    selectFormula(formulaId: string): void {
      const formula = findFormula(formulaId);
      this.activeFormulaId = formula.id;
      this.center = [...formula.initialView.center];
      this.scale = formula.initialView.scale;
      this.maxIterations = formula.suggestedIterations;
      this.parameterValues = createDefaultParameters(formula);
    },

    resetCamera(): void {
      const initialView = findFormula(this.activeFormulaId).initialView;
      this.center = [...initialView.center];
      this.scale = initialView.scale;
      this.colorOffset = 0;
    },

    panByPixels(deltaX: number, deltaY: number, viewportHeight: number): void {
      const height = Math.max(viewportHeight, 1);
      this.center = [
        this.center[0] - (deltaX / height) * this.scale,
        this.center[1] + (deltaY / height) * this.scale,
      ];
    },

    setCamera(center: ComplexValue, scale: number): void {
      this.center = [center[0], center[1]];
      this.scale = Math.max(1e-12, Math.min(8, scale));
    },

    zoomFromCenter(factor: number): void {
      this.scale = Math.max(1e-12, Math.min(8, this.scale * factor));
    },

    setParameter(key: string, value: FractalParameterValue): void {
      this.parameterValues = { ...this.parameterValues, [key]: value };
    },
  },
});
