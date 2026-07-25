<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  ReferenceOrbitCancelledError,
  ReferenceOrbitClient,
} from "../deep-zoom/reference-orbit-client.ts";
import type { ReferenceOrbitResult } from "../deep-zoom/types.ts";
import type { ComplexValue } from "../fractals/types.ts";
import { decimalDifferenceToNumber, shouldUseDeepZoom } from "../math/high-precision.ts";
import { DeepZoomRenderer } from "../renderer/deep-zoom-renderer.ts";
import { FractalRenderer } from "../renderer/fractal-renderer.ts";
import { useFractalStore } from "../stores/fractal.ts";

const store = useFractalStore();
const canvas = ref<HTMLCanvasElement>();
const errorMessage = ref("");
const deepZoomStatus = ref<"idle" | "preparing" | "ready" | "error">("idle");
const deepZoomPrecision = ref(0);
const deepZoomError = ref("");

const deepZoomMode = computed(
  () =>
    store.activeFormula.deepZoom?.backend === "mandelbrot-perturbation" &&
    shouldUseDeepZoom(store.magnification),
);
const deepZoomLabel = computed(() => {
  if (deepZoomStatus.value === "preparing") {
    return "Подготовка опорной орбиты…";
  }
  if (deepZoomStatus.value === "ready") {
    return `Deep zoom · ${deepZoomPrecision.value} digits`;
  }
  if (deepZoomStatus.value === "error") {
    return deepZoomError.value || "Deep zoom недоступен";
  }
  return "Deep zoom";
});

let renderer: FractalRenderer | undefined;
let deepRenderer: DeepZoomRenderer | undefined;
let referenceOrbit: ReferenceOrbitResult | undefined;
const referenceOrbitClient = new ReferenceOrbitClient();
let resizeObserver: ResizeObserver | undefined;
let renderFrame: number | undefined;
let interactionTimer: number | undefined;
let referenceTimer: number | undefined;
let quality = 1;

const activePointers = new Map<number, readonly [x: number, y: number]>();

const unsubscribe = store.$subscribe(() => scheduleRender(), {
  detached: true,
});

watch(
  () => store.activeFormulaId,
  () => {
    if (!renderer) {
      return;
    }

    try {
      renderer.setFormula(store.activeFormula);
      errorMessage.value = "";
      scheduleRender();
    } catch (error) {
      showError(error);
    }
  },
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
  referenceOrbitClient.cancel();
});

function initializeRenderer(): void {
  if (!canvas.value) {
    return;
  }

  try {
    renderer = new FractalRenderer(canvas.value);
    renderer.setFormula(store.activeFormula);
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
    scheduleRender();
  } catch (error) {
    renderer = undefined;
    deepRenderer = undefined;
    showError(error);
  }
}

function handleContextLost(event: Event): void {
  event.preventDefault();
  renderer = undefined;
  deepRenderer = undefined;
  referenceOrbit = undefined;
  referenceOrbitClient.cancel();
  errorMessage.value = "Контекст WebGL потерян. Ожидаем восстановления GPU.";
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
    if (
      !renderer ||
      !canvas.value ||
      canvas.value.clientWidth === 0 ||
      canvas.value.clientHeight === 0
    ) {
      return;
    }

    try {
      if (deepZoomMode.value && deepRenderer && referenceOrbit) {
        deepRenderer.resize(quality);
        deepRenderer.render({
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
        });
      } else {
        renderer.resize(quality);
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
  const center = [store.exactCenter[0], store.exactCenter[1]] as const;
  const scale = store.exactScale;
  const maxIterations = store.maxIterations;
  const viewportAspect = canvas.value
    ? canvas.value.clientWidth / Math.max(1, canvas.value.clientHeight)
    : 1;

  try {
    const result = await referenceOrbitClient.request({
      center,
      scale,
      maxIterations,
      viewportAspect,
    });

    if (
      !deepZoomMode.value ||
      store.exactCenter[0] !== center[0] ||
      store.exactCenter[1] !== center[1] ||
      store.exactScale !== scale ||
      store.maxIterations !== maxIterations
    ) {
      return;
    }

    deepRenderer?.setReferenceOrbit(result);
    referenceOrbit = result;
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

  <div v-if="deepZoomMode" class="deep-zoom-status" :data-state="deepZoomStatus" role="status">
    <i aria-hidden="true"></i>
    <span>{{ deepZoomLabel }}</span>
  </div>
</template>
