<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ComplexValue } from "../fractals/types.ts";
import { FractalRenderer } from "../renderer/fractal-renderer.ts";
import { useFractalStore } from "../stores/fractal.ts";

const store = useFractalStore();
const canvas = ref<HTMLCanvasElement>();
const errorMessage = ref("");

let renderer: FractalRenderer | undefined;
let resizeObserver: ResizeObserver | undefined;
let renderFrame: number | undefined;
let interactionTimer: number | undefined;
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
});

function initializeRenderer(): void {
  if (!canvas.value) {
    return;
  }

  try {
    renderer = new FractalRenderer(canvas.value);
    renderer.setFormula(store.activeFormula);
    errorMessage.value = "";
    scheduleRender();
  } catch (error) {
    renderer = undefined;
    showError(error);
  }
}

function handleContextLost(event: Event): void {
  event.preventDefault();
  renderer = undefined;
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
      const anchor = screenToComplex(previousGesture.midpoint[0], previousGesture.midpoint[1]);
      const nextScale = Math.max(
        1e-12,
        Math.min(8, store.scale * (previousGesture.distance / nextGesture.distance)),
      );
      const normalized = screenToNormalized(nextGesture.midpoint[0], nextGesture.midpoint[1]);
      store.setCamera(
        [anchor[0] - normalized[0] * nextScale, anchor[1] - normalized[1] * nextScale],
        nextScale,
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

  const anchor = screenToComplex(event.clientX, event.clientY);
  const factor = Math.exp(Math.max(-120, Math.min(120, event.deltaY)) * 0.002);
  const nextScale = Math.max(1e-12, Math.min(8, store.scale * factor));
  const ratio = nextScale / store.scale;

  store.setCamera(
    [
      anchor[0] + (store.center[0] - anchor[0]) * ratio,
      anchor[1] + (store.center[1] - anchor[1]) * ratio,
    ],
    nextScale,
  );
  beginBriefInteraction();
}

function handleDoubleClick(event: MouseEvent): void {
  const anchor = screenToComplex(event.clientX, event.clientY);
  const ratio = 0.45;
  store.setCamera(
    [
      anchor[0] + (store.center[0] - anchor[0]) * ratio,
      anchor[1] + (store.center[1] - anchor[1]) * ratio,
    ],
    store.scale * ratio,
  );
  beginBriefInteraction();
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    return;
  }

  const panStep = store.scale * 0.08;
  if (event.key === "ArrowLeft") {
    store.setCamera([store.center[0] - panStep, store.center[1]], store.scale);
  } else if (event.key === "ArrowRight") {
    store.setCamera([store.center[0] + panStep, store.center[1]], store.scale);
  } else if (event.key === "ArrowUp") {
    store.setCamera([store.center[0], store.center[1] + panStep], store.scale);
  } else if (event.key === "ArrowDown") {
    store.setCamera([store.center[0], store.center[1] - panStep], store.scale);
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
      renderer.resize(quality);
      renderer.render({
        center: store.center,
        scale: store.scale,
        maxIterations: store.maxIterations,
        palette: store.palette,
        colorDensity: store.colorDensity,
        colorOffset: store.colorOffset,
        parameters: store.parameterValues,
      });
    } catch (error) {
      showError(error);
    }
  });
}

function screenToComplex(clientX: number, clientY: number): ComplexValue {
  const normalized = screenToNormalized(clientX, clientY);
  return [
    store.center[0] + normalized[0] * store.scale,
    store.center[1] + normalized[1] * store.scale,
  ];
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
</template>
