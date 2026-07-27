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
import {
  canAcceptCalculatedReferenceOrbit,
  canReuseReferenceOrbit,
  canReuseReferenceRequest,
  type ReferenceViewport,
} from "../deep-zoom/reference-reuse.ts";
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
  if (!hasDeepZoomBackend(formula.deepZoom?.backend)) {
    return undefined;
  }
  return formula.deepZoom.backend;
});
const deepZoomMode = computed(() => {
  return deepZoomBackend.value !== undefined && shouldUseDeepZoom(store.magnification);
});
const deepZoomLimitReached = computed(() => {
  const formula = store.activeFormula;
  const limit = formula.deepZoom?.maxMagnification;
  return limit !== undefined && store.magnification >= limit * (1 - 1e-12);
});
const attractorMode = computed(() => store.activeFormula.renderer === "point-attractor");
const deepZoomLabel = computed(() => {
  if (deepZoomStatus.value === "preparing") {
    return "Подготовка опорной орбиты…";
  }
  if (deepZoomStatus.value === "ready") {
    const limit = store.activeFormula.deepZoom?.maxMagnification;
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
let referenceViewport: ReferenceViewport | undefined;
let pendingReferenceViewport: ReferenceViewport | undefined;
let attractorPoints: Float32Array | undefined;
const referenceOrbitClient = new ReferenceOrbitClient();
const cliffordTrajectoryClient = new CliffordTrajectoryClient();
let resizeObserver: ResizeObserver | undefined;
let renderFrame: number | undefined;
let interactionTimer: number | undefined;
let referenceTimer: number | undefined;
let attractorTimer: number | undefined;
let quality = 1;
let fullRenderDeferred = false;

const DEEP_ZOOM_PREVIEW_QUALITY = 0.48;
const DEFAULT_REFINEMENT_DELAY_MS = 140;
const ROOT_BASIN_DEEP_ZOOM_REFINEMENT_DELAY_MS = 280;
const REFERENCE_DEBOUNCE_MS = 180;

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
    referenceViewport = undefined;
    pendingReferenceViewport = undefined;
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
  referenceViewport = undefined;
  pendingReferenceViewport = undefined;
  attractorPoints = undefined;
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

async function exportPng(): Promise<void> {
  if (!canvas.value) {
    throw new Error("Canvas фрактала ещё не готов к экспорту.");
  }

  errorMessage.value = "";
  const sourceWidth = Math.max(1, Math.round(canvas.value.clientWidth));
  const sourceHeight = Math.max(1, Math.round(canvas.value.clientHeight));
  const outputWidth = sourceWidth * 2;
  const outputHeight = sourceHeight * 2;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = outputWidth;
  exportCanvas.height = outputHeight;
  exportCanvas.style.position = "fixed";
  exportCanvas.style.left = "-100000px";
  exportCanvas.style.top = "0";
  exportCanvas.style.width = `${sourceWidth}px`;
  exportCanvas.style.height = `${sourceHeight}px`;
  exportCanvas.style.pointerEvents = "none";
  document.body.append(exportCanvas);

  let exportRenderer: { dispose(): void } | undefined;

  try {
    const formula = store.activeFormula;
    const backend = deepZoomBackend.value;
    const parameterSignature = deepZoomParameterSignature(backend, store.parameterValues);

    if (
      deepZoomMode.value &&
      backend &&
      referenceOrbit?.backend === backend &&
      referenceOrbitSignature === parameterSignature
    ) {
      const renderer = new DeepZoomRenderer(exportCanvas);
      exportRenderer = renderer;
      renderer.setReferenceOrbit(referenceOrbit);
      renderer.render({
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
    } else if (formula.renderer === "escape-time") {
      const renderer = new FractalRenderer(exportCanvas);
      exportRenderer = renderer;
      renderer.setFormula(formula);
      renderer.render({
        center: store.center,
        scale: store.scale,
        maxIterations: store.maxIterations,
        palette: store.palette,
        colorDensity: store.colorDensity,
        colorOffset: store.colorOffset,
        smoothColors: store.smoothColors,
        parameters: store.parameterValues,
      });
    } else if (formula.renderer === "root-basin") {
      const renderer = new BasinRenderer(exportCanvas);
      exportRenderer = renderer;
      renderer.setFormula(formula);
      renderer.render({
        center: store.center,
        scale: store.scale,
        maxIterations: store.maxIterations,
        palette: store.palette,
        colorDensity: store.colorDensity,
        colorOffset: store.colorOffset,
        smoothColors: store.smoothColors,
        parameters: store.parameterValues,
      });
    } else if (formula.renderer === "point-attractor") {
      if (!attractorPoints) {
        throw new Error("Траектория аттрактора ещё не готова к экспорту.");
      }
      const renderer = new CliffordRenderer(exportCanvas);
      exportRenderer = renderer;
      renderer.setPoints(attractorPoints);
      renderer.render({
        center: store.center,
        scale: store.scale,
        palette: store.palette,
        colorOffset: store.colorOffset,
        exposure: numberParameter("exposure", 0.045),
        pointSize: numberParameter("pointSize", 1.25),
        pointFraction: 1,
      });
    } else {
      const renderer = new GeometricIfsRenderer(exportCanvas);
      exportRenderer = renderer;
      renderer.setFormula(formula);
      renderer.render({
        center: store.center,
        scale: store.scale,
        recursionDepthMode: store.recursionDepthMode,
        recursionDepth: store.recursionDepth,
        coloring: store.geometricColoring,
        palette: store.palette,
        colorOffset: store.colorOffset,
      });
    }

    const gl = exportCanvas.getContext("webgl2");
    if (!gl || gl.drawingBufferWidth !== outputWidth || gl.drawingBufferHeight !== outputHeight) {
      throw new Error(
        `GPU не поддерживает экспорт ${outputWidth.toLocaleString("ru-RU")} × ${outputHeight.toLocaleString("ru-RU")} px.`,
      );
    }

    const blob = await canvasToPng(exportCanvas);
    downloadBlob(blob, createExportFilename(formula.id, outputWidth, outputHeight));
  } catch (error) {
    showError(error);
    throw error;
  } finally {
    exportRenderer?.dispose();
    exportCanvas.remove();
  }
}

function canvasToPng(source: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    source.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Браузер не смог создать PNG из текущего вида."));
      }
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function createExportFilename(formulaId: string, width: number, height: number): string {
  const timestamp = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replace(/\.\d{3}Z$/, "Z");
  return `fractal-${formulaId}-${timestamp}-${width}x${height}.png`;
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
    finishInteraction();
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
  fullRenderDeferred = false;
  scheduleRender();
  const refinementDelay =
    deepZoomMode.value && isRootBasinDeepZoomBackend(deepZoomBackend.value)
      ? ROOT_BASIN_DEEP_ZOOM_REFINEMENT_DELAY_MS
      : DEFAULT_REFINEMENT_DELAY_MS;

  if (interactionTimer !== undefined) {
    window.clearTimeout(interactionTimer);
  }
  interactionTimer = window.setTimeout(() => {
    interactionTimer = undefined;
    finishInteraction();
  }, refinementDelay);
}

function finishInteraction(): void {
  if (hasPendingReferenceReplacement()) {
    fullRenderDeferred = true;
    return;
  }

  quality = 1;
  fullRenderDeferred = false;
  scheduleRender();
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
        if (!deepRenderer.canRenderFrame()) {
          deepRenderer.whenFrameAvailable(scheduleRender);
          return;
        }

        const isRootBasin = isRootBasinDeepZoomBackend(backend);
        const renderQuality = quality < 1 && isRootBasin ? DEEP_ZOOM_PREVIEW_QUALITY : quality;
        deepRenderer.resize(renderQuality);
        const rendered = deepRenderer.render({
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
        if (!rendered) {
          deepRenderer.whenFrameAvailable(scheduleRender);
        }
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
  const targetViewport = currentReferenceViewport();
  if (!targetViewport) {
    referenceOrbitClient.cancel();
    pendingReferenceViewport = undefined;
    if (referenceTimer !== undefined) {
      window.clearTimeout(referenceTimer);
      referenceTimer = undefined;
    }
    referenceOrbit = undefined;
    referenceOrbitSignature = "";
    referenceViewport = undefined;
    deepZoomStatus.value = "idle";
    deepZoomPrecision.value = 0;
    return;
  }

  if (!deepRenderer) {
    deepZoomStatus.value = "error";
    return;
  }

  if (
    referenceOrbit &&
    referenceViewport &&
    canReuseReferenceOrbit(referenceOrbit, referenceViewport, targetViewport)
  ) {
    if (referenceTimer !== undefined) {
      window.clearTimeout(referenceTimer);
      referenceTimer = undefined;
    }
    if (pendingReferenceViewport) {
      pendingReferenceViewport = undefined;
      referenceOrbitClient.cancel();
    }
    deepZoomStatus.value = "ready";
    finishDeferredFullRender();
    return;
  }

  deepZoomStatus.value = "preparing";
  deepZoomError.value = "";
  if (
    pendingReferenceViewport &&
    canReuseReferenceRequest(pendingReferenceViewport, targetViewport)
  ) {
    return;
  }

  if (pendingReferenceViewport) {
    pendingReferenceViewport = undefined;
    referenceOrbitClient.cancel();
  }
  if (referenceTimer !== undefined) {
    window.clearTimeout(referenceTimer);
  }
  referenceTimer = window.setTimeout(() => {
    referenceTimer = undefined;
    void prepareReferenceOrbit(targetViewport);
  }, REFERENCE_DEBOUNCE_MS);
}

async function prepareReferenceOrbit(viewport: ReferenceViewport): Promise<void> {
  const backend = viewport.backend;
  const parameters = copyFractalParameters(store.parameterValues);
  pendingReferenceViewport = viewport;

  try {
    const result = await referenceOrbitClient.request({
      backend,
      parameters,
      center: viewport.center,
      scale: viewport.scale,
      maxIterations: viewport.maxIterations,
      viewportAspect: viewport.viewportAspect,
    });
    if (pendingReferenceViewport === viewport) {
      pendingReferenceViewport = undefined;
    }

    const currentViewport = currentReferenceViewport();
    if (!currentViewport || !canAcceptCalculatedReferenceOrbit(result, viewport, currentViewport)) {
      scheduleReferenceOrbit();
      return;
    }

    const hadReference = referenceOrbit !== undefined;
    deepRenderer?.setReferenceOrbit(result);
    referenceOrbit = result;
    referenceOrbitSignature = viewport.parameterSignature;
    referenceViewport = viewport;
    deepZoomPrecision.value = result.precisionDigits;
    deepZoomStatus.value = "ready";
    if (!finishDeferredFullRender() && (!hadReference || quality === 1)) {
      scheduleRender();
    }
  } catch (error) {
    if (pendingReferenceViewport === viewport) {
      pendingReferenceViewport = undefined;
    }
    if (error instanceof ReferenceOrbitCancelledError) {
      return;
    }
    deepZoomError.value = error instanceof Error ? error.message : String(error);
    deepZoomStatus.value = referenceOrbit ? "ready" : "error";
  }
}

function currentReferenceViewport(): ReferenceViewport | undefined {
  const backend = deepZoomBackend.value;
  if (!deepZoomMode.value || !backend) {
    return undefined;
  }

  return {
    backend,
    parameterSignature: deepZoomParameterSignature(backend, store.parameterValues),
    center: [store.exactCenter[0], store.exactCenter[1]],
    scale: store.exactScale,
    maxIterations: store.maxIterations,
    viewportAspect: canvas.value
      ? canvas.value.clientWidth / Math.max(1, canvas.value.clientHeight)
      : 1,
  };
}

function hasPendingReferenceReplacement(): boolean {
  return (
    deepZoomMode.value && (referenceTimer !== undefined || pendingReferenceViewport !== undefined)
  );
}

function finishDeferredFullRender(): boolean {
  if (
    !fullRenderDeferred ||
    interactionTimer !== undefined ||
    activePointers.size > 0 ||
    hasPendingReferenceReplacement()
  ) {
    return false;
  }

  quality = 1;
  fullRenderDeferred = false;
  scheduleRender();
  return true;
}

function deepZoomParameterSignature(
  backend: DeepZoomBackendId | undefined,
  parameters: Readonly<Record<string, FractalParameterValue>>,
): string {
  if (!backend) {
    return "";
  }

  const orbitParameterKeys =
    backend === "julia-perturbation"
      ? ["constant"]
      : backend === "phoenix-perturbation"
        ? ["constant", "memory"]
        : backend === "nova-cubic-perturbation"
          ? ["relaxation"]
          : [];

  return `${backend}|${orbitParameterKeys
    .map((key) => `${key}:${JSON.stringify(parameters[key])}`)
    .join("|")}`;
}

function isRootBasinDeepZoomBackend(backend: DeepZoomBackendId | undefined): boolean {
  return backend === "newton-cubic-perturbation" || backend === "nova-cubic-perturbation";
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
    attractorPoints = undefined;
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
    attractorPoints = result.values;
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

defineExpose({
  exportPng,
});
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
