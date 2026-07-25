<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import ControlPanel from "./components/ControlPanel.vue";
import FractalCanvas from "./components/FractalCanvas.vue";
import { formatDecimalCoordinate } from "./math/high-precision.ts";
import { useFractalStore } from "./stores/fractal.ts";

const store = useFractalStore();
const { exactCenter, exactScale, magnification } = storeToRefs(store);

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
</script>

<template>
  <main class="viewer">
    <section class="stage" aria-label="Область просмотра фрактала">
      <FractalCanvas />

      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Fractal Lab</span>
        </div>
        <div class="coordinates" aria-live="polite">
          <span id="zoom-readout">{{ zoomReadout }}</span>
          <span class="coordinate-divider"></span>
          <span id="center-readout">{{ centerReadout }}</span>
        </div>
      </header>

      <div class="gesture-hint">
        <span class="desktop-hint">Перетаскивание — перемещение</span>
        <span class="desktop-hint">Колесо — масштаб</span>
        <span class="mobile-hint">Один палец — перемещение · два — масштаб</span>
      </div>
    </section>

    <ControlPanel />
  </main>
</template>
