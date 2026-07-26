<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ControlPanel from "./components/ControlPanel.vue";
import CoordinatesDialog from "./components/CoordinatesDialog.vue";
import FractalCanvas from "./components/FractalCanvas.vue";
import { formatDecimalCoordinate } from "./math/high-precision.ts";
import { useFractalStore } from "./stores/fractal.ts";

const store = useFractalStore();
const { exactCenter, exactScale, magnification } = storeToRefs(store);
const fractalCanvas = ref<InstanceType<typeof FractalCanvas>>();
const controlsVisible = ref(!window.matchMedia("(max-width: 760px)").matches);
const coordinatesOpen = ref(false);
const exporting = ref(false);

const zoomReadout = computed(() => `${formatZoom(magnification.value)}×`);
const centerReadout = computed(
  () =>
    `${formatDecimalCoordinate(exactCenter.value[0], exactScale.value)} ${
      exactCenter.value[1].startsWith("-") ? "−" : "+"
    } ${formatDecimalCoordinate(exactCenter.value[1].replace("-", ""), exactScale.value)}i`,
);

function formatZoom(value: number): string {
  if (value >= 1_000_000) return value.toExponential(2);
  if (value >= 100) return Math.round(value).toLocaleString("ru-RU");
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

async function exportPng(): Promise<void> {
  if (!fractalCanvas.value || exporting.value) {
    return;
  }

  exporting.value = true;
  try {
    await fractalCanvas.value.exportPng();
  } catch {
    // FractalCanvas reports a detailed export error in the viewer.
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <main class="viewer" :class="{ 'has-controls': controlsVisible }">
    <section class="stage" aria-label="Область просмотра фрактала">
      <FractalCanvas ref="fractalCanvas" />

      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Fractal Lab</span>
        </div>
        <button
          class="coordinates"
          type="button"
          aria-label="Открыть точные координаты и масштаб"
          title="Задать точные координаты и масштаб"
          @click="coordinatesOpen = true"
        >
          <span id="zoom-readout">{{ zoomReadout }}</span>
          <span class="coordinate-divider"></span>
          <span id="center-readout">{{ centerReadout }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 15 6-6m-4 0h4v4" />
          </svg>
        </button>
      </header>

      <div class="gesture-hint">
        <span class="desktop-hint">Перетаскивание — перемещение</span>
        <span class="desktop-hint">Колесо — масштаб</span>
        <span class="mobile-hint">Один палец — перемещение · два — масштаб</span>
      </div>
    </section>

    <ControlPanel
      v-if="controlsVisible"
      :exporting="exporting"
      @hide="controlsVisible = false"
      @export-png="exportPng"
    />

    <button
      v-else
      class="show-controls-button"
      type="button"
      aria-label="Показать панель параметров"
      title="Показать панель параметров"
      @click="controlsVisible = true"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h10M4 12h16M4 17h10" />
        <circle cx="17" cy="7" r="2" />
        <circle cx="13" cy="17" r="2" />
      </svg>
      <span>Параметры</span>
    </button>

    <CoordinatesDialog v-if="coordinatesOpen" @close="coordinatesOpen = false" />
  </main>
</template>
