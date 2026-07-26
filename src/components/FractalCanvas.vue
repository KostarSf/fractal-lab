<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  CliffordTrajectoryCancelledError,
  CliffordTrajectoryClient,
} from "../attractors/clifford-client.ts";
import {
  ReferenceOrbitCancelledError,
  ReferenceOrbitClient,
} from "../deep-zoom/reference-orbit-client.ts";
import { hasDeepZoomBackend } from "../deep-zoom/registry.ts";
import type { ReferenceOrbitResult } from "../deep-zoom/types.ts";
import type { ComplexValue, DeepZoomBackendId, FractalParameterValue } from "../fractals/types.ts";
import { decimalDifferenceToNumber, shouldUseDeepZoom } from "../math/high-precision.ts";
import { BasinRenderer } from "../renderer/basin-renderer.ts";
import { CliffordRenderer } from "../renderer/clifford-renderer.ts";
import { DeepZoomRenderer } from "../renderer/deep-zoom-renderer.ts";
import { FractalRenderer } from "../renderer/fractal-renderer.ts";
import { GeometricIfsRenderer } from "../renderer/geometric-ifs-renderer.ts";
import { useFractalStore } from "../stores/fractal.ts";

const store = useFractalStore();
const canvas = ref<HTMLCanvasElement>();
const errorMessage = ref("");
const deepZoomStatus = ref<"idle" | "preparing" | "ready" | "error">("idle");
const deepZoomPrecision = ref(0);
const deepZoomError = ref("");
const attractorStatus = ref<"idle" | "preparing" | "ready" | "error">("idle");
const attractorPointCount = ref(0);
const attractorError = ref("");

const deepZoomBackend = computed<DeepZoomBackendId | undefined>(() => {
  const formula = store.activeFormula;
  if (formula.renderer !== "escape-time" || !hasDeepZoomBackend(formula.deepZoom?.backend)) {
    return undefined;
  }
  return formula.deepZoom.backend;
});
const deepZoomMode = computed(() => {
  return deepZoomBackend.value !== undefined && shouldUseDeepZoom(store.magnification);
});
const deepZoomLimitReached = computed(() => {
  const formula = store.activeFormula;
  const limit = formula.renderer === "escape-time" ? formula.deepZoom?.maxMagnification : undefined;
  return limit !== undefined && store.magnification >= limit * (1 - 1e-12);
});
const attractorMode = computed(() => store.activeFormula.renderer === "point-attractor");
const deepZoomLabel = computed(() => {
  if (deepZoomStatus.value === "preparing") {
    return "Подготовка опорной орбиты…";
  }
  if (deepZoomStatus.value === "ready") {
    const limit =
      store.activeFormula.renderer === "escape-time"
        ? store.activeFormula.deepZoom?.maxMagnification
        : undefined;
    if (deepZoomLimitReached.value && limit !== undefined) {
      return `Deep zoom · предел ${limit.toExponential(2)}×`;
    }
    return `Deep zoom · ${deepZoomPrecision.value} digits`;
  }
  if (deepZoomStatus.value === "error") {
    return deepZoomError.value || "Deep zoom недоступен";
  }
  return "Deep zoom";
});
const attractorLabel = computed(() => {
  if (attractorStatus.value === "preparing") {
    return "Расчёт траектории…";
  }
  if (attractorStatus.value === "ready") {
    return `Clifford · ${attractorPointCount.value.toLocaleString("ru-RU")} точек`;
  }
  if (attractorStatus.value === "error") {
    return attractorError.value || "Аттрактор недоступен";
  }
  return "Clifford attractor";
});

let escapeRenderer: FractalRenderer | undefined;
let basinRenderer: BasinRenderer | undefined;
let cliffordRenderer: CliffordRenderer | undefined;
let geometricIfsRenderer: GeometricIfsRenderer | undefined;
let deepRenderer: DeepZoomRenderer | undefined;
let referenceOrbit: ReferenceOrbitResult | undefined;
let referenceOrbitSignature = "";
const referenceOrbitClient = new ReferenceOrbitClient();
const cliffordTrajectoryClient = new CliffordTrajectoryClient();
let resizeObserver: ResizeObserver | undefined;
let renderFrame: number | undefined;
let interactionTimer: number | undefined;
let referenceTimer: number | undefined;
let attractorTimer: number | undefined;
let quality = 1;

const activePointers = new Map<number, readonly [x: number, y: number]>();

const unsubscribe = store.$subscribe(() => scheduleRender(), {
  detached: true,
});

watch(
  () => store.activeFormulaId,
  () => {
    if (!canvas.value) {
      return;
    }

    try {
      configureActiveRenderer();
      errorMessage.value = "";
      scheduleRender();
    } catch (error) {
      showError(error);
    }
  },
  { flush: "sync" },
);

watch(
  [() => store.activeFormulaId, () => cliffordOrbitSignature()],
  () => scheduleCliffordTrajectory(),
  { flush: "sync" },
);

watch(
  () => [store.maxIterations, store.colorDensity, store.parameterValues],
  () => beginBriefInteraction(),
  { deep: true },
);

watch(
  () => [
    store.activeFormulaId,
    store.exactCenter[0],
    store.exactCenter[1],
    store.exactScale,
    store.maxIterations,
    deepZoomParameterSignature(deepZoomBackend.value, store.parameterValues),
  ],
  () => scheduleReferenceOrbit(),
  { flush: "sync" },
);

onMounted(() => {
  initializeRenderer();
  resizeObserver = new ResizeObserver(() => scheduleRender());
  resizeObserver.observe(canvas.value!);
  window.addEventListener("keydown", handleKeydown);
  canvas.value!.addEventListener("webglcontextlost", handleContextLost);
  canvas.value!.addEventListener("webglcontextrestored", initializeRenderer);
});

onBeforeUnmount(() => {
  unsubscribe();
  resizeObserver?.disconnect();
  window.removeEventListener("keydown", handleKeydown);
  canvas.value?.removeEventListener("webglcontextlost", handleContextLost);
  canvas.value?.removeEventListener("webglcontextrestored", initializeRenderer);
  if (renderFrame !== undefined) window.cancelAnimationFrame(renderFrame);
  if (interactionTimer !== undefined) window.clearTimeout(interactionTimer);
  if (referenceTimer !== undefined) window.clearTimeout(referenceTimer);
  if (attractorTimer !== undefined) window.clearTimeout(attractorTimer);
  referenceOrbitClient.cancel();
  cliffordTrajectoryClient.cancel();
  disposeRenderers();
});

function initializeRenderer(): void {
  if (!canvas.value) {
    return;
  }

  try {
    disposeRenderers();
    referenceOrbit = undefined;
    referenceOrbitSignature = "";
    escapeRenderer = new FractalRenderer(canvas.value);
    basinRenderer = new BasinRenderer(canvas.value);
    cliffordRenderer = new CliffordRenderer(canvas.value);
    geometricIfsRenderer = new GeometricIfsRenderer(canvas.value);
    configureActiveRenderer();
    try {
      deepRenderer = new DeepZoomRenderer(canvas.value);
      deepZoomError.value = "";
    } catch (error) {
      deepRenderer = undefined;
      deepZoomStatus.value = "error";
      deepZoomError.value = error instanceof Error ? error.message : String(error);
    }
    errorMessage.value = "";
    scheduleReferenceOrbit();
    scheduleCliffordTrajectory();
    scheduleRender();
  } catch (error) {
    disposeRenderers();
    showError(error);
  }
}

function handleContextLost(event: Event): void {
  event.preventDefault();
  escapeRenderer = undefined;
  basinRenderer = undefined;
  cliffordRenderer = undefined;
  geometricIfsRenderer = undefined;
  deepRenderer = undefined;
  referenceOrbit = undefined;
  referenceOrbitClient.cancel();
  cliffordTrajectoryClient.cancel();
  errorMessage.value = "Контекст WebGL потерян. Ожидаем восстановления GPU.";
}

function configureActiveRenderer(): void {
  const formula = store.activeFormula;
  if (formula.renderer === "escape-time") {
    escapeRenderer?.setFormula(formula);
  } else if (formula.renderer === "root-basin") {
    basinRenderer?.setFormula(formula);
  } else if (formula.renderer === "geometric-ifs") {
    geometricIfsRenderer?.setFormula(formula);
  }
}

function disposeRenderers(): void {
  escapeRenderer?.dispose();
  basinRenderer?.dispose();
  cliffordRenderer?.dispose();
  geometricIfsRenderer?.dispose();
  deepRenderer?.dispose();
  escapeRenderer = undefined;
  basinRenderer = undefined;
  cliffordRenderer = undefined;
  geometricIfsRenderer = undefined;
  deepRenderer = undefined;
}

function showError(error: unknown): void {
  errorMessage.value = error instanceof Error ? error.message : String(error);
}

function handlePointerDown(event: PointerEvent): void {
  if ((event.pointerType === "mouse" && event.button !== 0) || activePointers.size >= 2) {
    return;
  }

  activePointers.set(event.pointerId, [event.clientX, event.clientY]);
  canvas.value!.setPointerCapture(event.pointerId);
  canvas.value!.classList.add("is-dragging");
  quality = 0.58;
}

function handlePointerMove(event: PointerEvent): void {
  const previousPosition = activePointers.get(event.pointerId);
  if (!previousPosition || !canvas.value) {
    return;
  }

  if (activePointers.size === 1) {
    store.panByPixels(
      event.clientX - previousPosition[0],
      event.clientY - previousPosition[1],
      canvas.value.clientHeight,
    );
    activePointers.set(event.pointerId, [event.clientX, event.clientY]);
  } else {
    const previousGesture = getGestureMetrics();
    activePointers.set(event.pointerId, [event.clientX, event.clientY]);
    const nextGesture = getGestureMetrics();

    if (previousGesture && nextGesture && nextGesture.distance > 0) {
      store.transformCamera(
        screenToNormalized(previousGesture.midpoint[0], previousGesture.midpoint[1]),
        screenToNormalized(nextGesture.midpoint[0], nextGesture.midpoint[1]),
        previousGesture.distance / nextGesture.distance,
      );
    }
  }
}

function handlePointerEnd(event: PointerEvent): void {
  if (!activePointers.delete(event.pointerId)) {
    return;
  }

  canvas.value?.classList.toggle("is-dragging", activePointers.size > 0);
  if (activePointers.size === 0) {
    quality = 1;
    scheduleRender();
  }
}

function handleWheel(event: WheelEvent): void {
  event.preventDefault();

  const normalized = screenToNormalized(event.clientX, event.clientY);
  const factor = Math.exp(Math.max(-120, Math.min(120, event.deltaY)) * 0.002);
  store.transformCamera(normalized, normalized, factor);
  beginBriefInteraction();
}

function handleDoubleClick(event: MouseEvent): void {
  const normalized = screenToNormalized(event.clientX, event.clientY);
  store.transformCamera(normalized, normalized, 0.45);
  beginBriefInteraction();
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    return;
  }

  if (event.key === "ArrowLeft") {
    store.panByNormalized([-0.08, 0]);
  } else if (event.key === "ArrowRight") {
    store.panByNormalized([0.08, 0]);
  } else if (event.key === "ArrowUp") {
    store.panByNormalized([0, 0.08]);
  } else if (event.key === "ArrowDown") {
    store.panByNormalized([0, -0.08]);
  } else if (event.key === "+" || event.key === "=") {
    store.zoomFromCenter(0.8);
  } else if (event.key === "-") {
    store.zoomFromCenter(1.25);
  } else {
    return;
  }

  event.preventDefault();
  beginBriefInteraction();
}

function beginBriefInteraction(): void {
  quality = 0.68;
  scheduleRender();

  if (interactionTimer !== undefined) {
    window.clearTimeout(interactionTimer);
  }
  interactionTimer = window.setTimeout(() => {
    quality = 1;
    interactionTimer = undefined;
    scheduleRender();
  }, 140);
}

function scheduleRender(): void {
  if (renderFrame !== undefined) {
    return;
  }

  renderFrame = window.requestAnimationFrame(() => {
    renderFrame = undefined;
    if (!canvas.value || canvas.value.clientWidth === 0 || canvas.value.clientHeight === 0) {
      return;
    }

    try {
      const formula = store.activeFormula;
      const backend = deepZoomBackend.value;
      const parameterSignature = deepZoomParameterSignature(backend, store.parameterValues);
      if (
        deepZoomMode.value &&
        backend &&
        deepRenderer &&
        referenceOrbit?.backend === backend &&
        referenceOrbitSignature === parameterSignature
      ) {
        deepRenderer.resize(quality);
        deepRenderer.render({
          backend,
          centerDelta: [
            decimalDifferenceToNumber(
              store.exactCenter[0],
              referenceOrbit.center[0],
              store.exactScale,
            ),
            decimalDifferenceToNumber(
              store.exactCenter[1],
              referenceOrbit.center[1],
              store.exactScale,
            ),
          ],
          scale: Number(store.exactScale),
          maxIterations: store.maxIterations,
          palette: store.palette,
          colorDensity: store.colorDensity,
          colorOffset: store.colorOffset,
          smoothColors: store.smoothColors,
          parameters: store.parameterValues,
        });
      } else if (formula.renderer === "escape-time" && escapeRenderer) {
        escapeRenderer.resize(quality);
        escapeRenderer.render({
          center: store.center,
          scale: store.scale,
          maxIterations: store.maxIterations,
          palette: store.palette,
          colorDensity: store.colorDensity,
          colorOffset: store.colorOffset,
          smoothColors: store.smoothColors,
          parameters: store.parameterValues,
        });
      } else if (formula.renderer === "root-basin" && basinRenderer) {
        basinRenderer.resize(quality);
        basinRenderer.render({
          center: store.center,
          scale: store.scale,
          maxIterations: store.maxIterations,
          palette: store.palette,
          colorDensity: store.colorDensity,
          colorOffset: store.colorOffset,
          smoothColors: store.smoothColors,
          parameters: store.parameterValues,
        });
      } else if (formula.renderer === "point-attractor" && cliffordRenderer) {
        cliffordRenderer.resize(quality);
        cliffordRenderer.render({
          center: store.center,
          scale: store.scale,
          palette: store.palette,
          colorOffset: store.colorOffset,
          exposure: numberParameter("exposure", 0.045),
          pointSize: numberParameter("pointSize", 1.25),
          pointFraction: quality * quality,
        });
      } else if (formula.renderer === "geometric-ifs" && geometricIfsRenderer) {
        geometricIfsRenderer.resize(quality);
        geometricIfsRenderer.render({
          center: store.center,
          scale: store.scale,
          recursionDepthMode: store.recursionDepthMode,
          recursionDepth: store.recursionDepth,
          coloring: store.geometricColoring,
          palette: store.palette,
          colorOffset: store.colorOffset,
        });
      }
    } catch (error) {
      showError(error);
    }
  });
}

function scheduleReferenceOrbit(): void {
  referenceOrbitClient.cancel();
  if (referenceTimer !== undefined) {
    window.clearTimeout(referenceTimer);
    referenceTimer = undefined;
  }

  if (!deepZoomMode.value) {
    referenceOrbit = undefined;
    referenceOrbitSignature = "";
    deepZoomStatus.value = "idle";
    deepZoomPrecision.value = 0;
    return;
  }

  if (!deepRenderer) {
    deepZoomStatus.value = "error";
    return;
  }

  deepZoomStatus.value = "preparing";
  deepZoomError.value = "";
  referenceTimer = window.setTimeout(() => {
    referenceTimer = undefined;
    void prepareReferenceOrbit();
  }, 120);
}

async function prepareReferenceOrbit(): Promise<void> {
  const backend = deepZoomBackend.value;
  if (!backend) {
    return;
  }

  const center = [store.exactCenter[0], store.exactCenter[1]] as const;
  const scale = store.exactScale;
  const maxIterations = store.maxIterations;
  const parameters = copyFractalParameters(store.parameterValues);
  const parameterSignature = deepZoomParameterSignature(backend, parameters);
  const viewportAspect = canvas.value
    ? canvas.value.clientWidth / Math.max(1, canvas.value.clientHeight)
    : 1;

  try {
    const result = await referenceOrbitClient.request({
      backend,
      parameters,
      center,
      scale,
      maxIterations,
      viewportAspect,
    });

    if (
      !deepZoomMode.value ||
      deepZoomBackend.value !== backend ||
      deepZoomParameterSignature(deepZoomBackend.value, store.parameterValues) !==
        parameterSignature ||
      store.exactCenter[0] !== center[0] ||
      store.exactCenter[1] !== center[1] ||
      store.exactScale !== scale ||
      store.maxIterations !== maxIterations
    ) {
      return;
    }

    deepRenderer?.setReferenceOrbit(result);
    referenceOrbit = result;
    referenceOrbitSignature = parameterSignature;
    deepZoomPrecision.value = result.precisionDigits;
    deepZoomStatus.value = "ready";
    scheduleRender();
  } catch (error) {
    if (error instanceof ReferenceOrbitCancelledError) {
      return;
    }
    deepZoomStatus.value = "error";
    deepZoomError.value = error instanceof Error ? error.message : String(error);
  }
}

function deepZoomParameterSignature(
  backend: DeepZoomBackendId | undefined,
  parameters: Readonly<Record<string, FractalParameterValue>>,
): string {
  if (!backend) {
    return "";
  }

  return `${backend}|${Object.keys(parameters)
    .sort()
    .map((key) => `${key}:${JSON.stringify(parameters[key])}`)
    .join("|")}`;
}

function copyFractalParameters(
  parameters: Readonly<Record<string, FractalParameterValue>>,
): Record<string, FractalParameterValue> {
  const copy: Record<string, FractalParameterValue> = {};
  for (const [key, value] of Object.entries(parameters)) {
    copy[key] = Array.isArray(value) ? [value[0]!, value[1]!] : value;
  }
  return copy;
}

function cliffordOrbitSignature(): string {
  const formula = store.activeFormula;
  if (formula.renderer !== "point-attractor") {
    return "";
  }

  return formula.parameters
    .filter((parameter) => parameter.affectsOrbit !== false)
    .map((parameter) => `${parameter.key}:${String(store.parameterValues[parameter.key])}`)
    .join("|");
}

function numberParameter(key: string, fallback: number): number {
  const value = store.parameterValues[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function scheduleCliffordTrajectory(): void {
  cliffordTrajectoryClient.cancel();
  if (attractorTimer !== undefined) {
    window.clearTimeout(attractorTimer);
    attractorTimer = undefined;
  }

  if (!attractorMode.value) {
    cliffordRenderer?.clearPoints();
    attractorStatus.value = "idle";
    attractorPointCount.value = 0;
    return;
  }
  if (!cliffordRenderer) {
    attractorStatus.value = "error";
    attractorError.value = "WebGL2 renderer аттрактора недоступен.";
    return;
  }

  attractorStatus.value = "preparing";
  attractorError.value = "";
  attractorTimer = window.setTimeout(() => {
    attractorTimer = undefined;
    void prepareCliffordTrajectory();
  }, 100);
}

async function prepareCliffordTrajectory(): Promise<void> {
  const signature = cliffordOrbitSignature();
  const request = {
    a: numberParameter("a", -1.4),
    b: numberParameter("b", 1.6),
    c: numberParameter("c", 1),
    d: numberParameter("d", 0.7),
    burnIn: numberParameter("burnIn", 100),
    pointCount: numberParameter("pointCount", 500_000),
  };

  try {
    const result = await cliffordTrajectoryClient.request(request);
    if (!attractorMode.value || cliffordOrbitSignature() !== signature) {
      return;
    }

    cliffordRenderer?.setPoints(result.values);
    attractorPointCount.value = result.pointCount;
    attractorStatus.value = "ready";
    scheduleRender();
  } catch (error) {
    if (error instanceof CliffordTrajectoryCancelledError) {
      return;
    }
    attractorStatus.value = "error";
    attractorError.value = error instanceof Error ? error.message : String(error);
  }
}

function screenToNormalized(clientX: number, clientY: number): ComplexValue {
  const bounds = canvas.value!.getBoundingClientRect();
  return [
    (clientX - bounds.left - bounds.width * 0.5) / bounds.height,
    (bounds.height * 0.5 - (clientY - bounds.top)) / bounds.height,
  ];
}

function getGestureMetrics():
  | {
      readonly midpoint: ComplexValue;
      readonly distance: number;
    }
  | undefined {
  const [first, second] = activePointers.values();
  if (!first || !second) {
    return undefined;
  }

  return {
    midpoint: [(first[0] + second[0]) * 0.5, (first[1] + second[1]) * 0.5],
    distance: Math.hypot(second[0] - first[0], second[1] - first[1]),
  };
}
</script>

<template>
  <canvas
    ref="canvas"
    id="fractal-canvas"
    aria-label="Визуализация фрактала"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerEnd"
    @pointercancel="handlePointerEnd"
    @wheel="handleWheel"
    @dblclick="handleDoubleClick"
  ></canvas>

  <div v-if="errorMessage" class="render-error">
    <strong>Не удалось запустить GPU-рендерер</strong>
    <span>{{ errorMessage }}</span>
  </div>

  <div
    v-if="deepZoomMode"
    class="deep-zoom-status"
    :data-state="deepZoomStatus"
    :data-limit="deepZoomLimitReached"
    role="status"
  >
    <i aria-hidden="true"></i>
    <span>{{ deepZoomLabel }}</span>
  </div>

  <div
    v-if="attractorMode"
    class="deep-zoom-status attractor-status"
    :data-state="attractorStatus"
    role="status"
  >
    <i aria-hidden="true"></i>
    <span>{{ attractorLabel }}</span>
  </div>
</template>
