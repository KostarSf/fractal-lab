import { defineStore } from "pinia";
import { createDefaultParameters, FRACTAL_FORMULAS } from "../fractals/formulas.ts";
import type { ComplexValue, FractalParameterValue } from "../fractals/types.ts";
import {
  approximateCamera,
  clampCameraScale,
  createSerializedCamera,
  MIN_CAMERA_SCALE,
  transformCamera,
  translateCamera,
  type SerializedCamera,
} from "../math/high-precision.ts";

const DEFAULT_FORMULA = FRACTAL_FORMULAS[0]!;

interface FractalState {
  activeFormulaId: string;
  center: [number, number];
  scale: number;
  exactCenter: [string, string];
  exactScale: string;
  maxIterations: number;
  palette: number;
  colorDensity: number;
  colorOffset: number;
  smoothColors: boolean;
  parameterValues: Record<string, FractalParameterValue>;
}

function findFormula(id: string) {
  return FRACTAL_FORMULAS.find((formula) => formula.id === id) ?? DEFAULT_FORMULA;
}

function cameraForFormula(formulaId: string): SerializedCamera {
  const view = findFormula(formulaId).initialView;
  return createSerializedCamera(view.center, view.scale);
}

function minimumScaleForFormula(formulaId: string): string {
  const formula = findFormula(formulaId);
  if (formula.renderer === "escape-time" && formula.deepZoom?.maxMagnification !== undefined) {
    return String(formula.initialView.scale / formula.deepZoom.maxMagnification);
  }
  return MIN_CAMERA_SCALE;
}

function applyCamera(state: FractalState, camera: SerializedCamera): void {
  const constrainedCamera = clampCameraScale(camera, minimumScaleForFormula(state.activeFormulaId));
  const approximate = approximateCamera(constrainedCamera);
  state.center = approximate.center;
  state.scale = approximate.scale;
  state.exactCenter = [constrainedCamera.center[0], constrainedCamera.center[1]];
  state.exactScale = constrainedCamera.scale;
}

export const useFractalStore = defineStore("fractal", {
  state: (): FractalState => {
    const camera = cameraForFormula(DEFAULT_FORMULA.id);
    const approximate = approximateCamera(camera);
    return {
      activeFormulaId: DEFAULT_FORMULA.id,
      center: approximate.center,
      scale: approximate.scale,
      exactCenter: [camera.center[0], camera.center[1]],
      exactScale: camera.scale,
      maxIterations: DEFAULT_FORMULA.suggestedIterations,
      palette: 0,
      colorDensity: 0.075,
      colorOffset: 0,
      smoothColors: true,
      parameterValues: createDefaultParameters(DEFAULT_FORMULA),
    };
  },

  getters: {
    activeFormula: (state) => findFormula(state.activeFormulaId),
    magnification: (state) => findFormula(state.activeFormulaId).initialView.scale / state.scale,
  },

  actions: {
    selectFormula(formulaId: string): void {
      const formula = findFormula(formulaId);
      this.activeFormulaId = formula.id;
      applyCamera(this, cameraForFormula(formula.id));
      this.maxIterations = formula.suggestedIterations;
      this.parameterValues = createDefaultParameters(formula);
    },

    resetCamera(): void {
      applyCamera(this, cameraForFormula(this.activeFormulaId));
      this.colorOffset = 0;
    },

    panByPixels(deltaX: number, deltaY: number, viewportHeight: number): void {
      const height = Math.max(viewportHeight, 1);
      applyCamera(
        this,
        translateCamera(
          {
            center: this.exactCenter,
            scale: this.exactScale,
          },
          [-deltaX / height, deltaY / height],
        ),
      );
    },

    panByNormalized(normalizedOffset: ComplexValue): void {
      applyCamera(
        this,
        translateCamera(
          {
            center: this.exactCenter,
            scale: this.exactScale,
          },
          normalizedOffset,
        ),
      );
    },

    setCamera(center: ComplexValue, scale: number): void {
      applyCamera(this, createSerializedCamera(center, scale));
    },

    setExactCamera(camera: SerializedCamera): void {
      applyCamera(this, camera);
    },

    transformCamera(
      previousNormalized: ComplexValue,
      nextNormalized: ComplexValue,
      scaleFactor: number,
    ): void {
      const camera = {
        center: this.exactCenter,
        scale: this.exactScale,
      } satisfies SerializedCamera;
      const nextCamera = transformCamera(
        camera,
        previousNormalized,
        nextNormalized,
        scaleFactor,
        minimumScaleForFormula(this.activeFormulaId),
      );

      if (
        nextCamera.center[0] === camera.center[0] &&
        nextCamera.center[1] === camera.center[1] &&
        nextCamera.scale === camera.scale
      ) {
        return;
      }

      applyCamera(this, nextCamera);
    },

    zoomFromCenter(factor: number): void {
      this.transformCamera([0, 0], [0, 0], factor);
    },

    setParameter(key: string, value: FractalParameterValue): void {
      const parameter = this.activeFormula.parameters.find((candidate) => candidate.key === key);
      let nextValue = value;
      if (parameter?.type === "number" && typeof value === "number") {
        nextValue = Math.max(
          parameter.min ?? Number.NEGATIVE_INFINITY,
          Math.min(parameter.max ?? Number.POSITIVE_INFINITY, value),
        );
      }
      this.parameterValues = { ...this.parameterValues, [key]: nextValue };
    },
  },
});
