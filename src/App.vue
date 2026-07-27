<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref } from "vue";
import ControlPanel from "./components/ControlPanel.vue";
import CoordinatesDialog from "./components/CoordinatesDialog.vue";
import FractalCanvas from "./components/FractalCanvas.vue";
import FormulaPickerDialog from "./components/FormulaPickerDialog.vue";
import { formatDecimalCoordinate } from "./math/high-precision.ts";
import { useFractalStore } from "./stores/fractal.ts";

const store = useFractalStore();
const { exactCenter, exactScale, magnification } = storeToRefs(store);
const fractalCanvas = ref<InstanceType<typeof FractalCanvas>>();
const mobileMedia = window.matchMedia("(max-width: 760px)");
const isMobile = ref(mobileMedia.matches);
const controlsVisible = ref(true);
const coordinatesOpen = ref(false);
const formulaPickerOpen = ref(false);
const settingsOpen = ref(false);
const mobileMenuOpen = ref(false);
const exporting = ref(false);

const zoomReadout = computed(() => `${formatZoom(magnification.value)}×`);
const centerReadout = computed(
  () =>
    `${formatDecimalCoordinate(exactCenter.value[0], exactScale.value)} ${
      exactCenter.value[1].startsWith("-") ? "−" : "+"
    } ${formatDecimalCoordinate(exactCenter.value[1].replace("-", ""), exactScale.value)}i`,
);

mobileMedia.addEventListener("change", handleMobileChange);
window.addEventListener("keydown", handleGlobalKeydown);
window.addEventListener("wheel", preventBrowserWheelZoom, { passive: false });
document.addEventListener("gesturestart", preventPageZoom, { passive: false });
document.addEventListener("gesturechange", preventPageZoom, { passive: false });

onBeforeUnmount(() => {
  mobileMedia.removeEventListener("change", handleMobileChange);
  window.removeEventListener("keydown", handleGlobalKeydown);
  window.removeEventListener("wheel", preventBrowserWheelZoom);
  document.removeEventListener("gesturestart", preventPageZoom);
  document.removeEventListener("gesturechange", preventPageZoom);
});

function formatZoom(value: number): string {
  if (value >= 1_000_000) return value.toExponential(2);
  if (value >= 100) return Math.round(value).toLocaleString("ru-RU");
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function handleMobileChange(event: MediaQueryListEvent): void {
  isMobile.value = event.matches;
  mobileMenuOpen.value = false;
  settingsOpen.value = false;
}

function handleGlobalKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
}

function preventBrowserWheelZoom(event: WheelEvent): void {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}

function preventPageZoom(event: Event): void {
  event.preventDefault();
}

function openMobileDialog(dialog: "gallery" | "settings"): void {
  mobileMenuOpen.value = false;
  if (dialog === "gallery") {
    formulaPickerOpen.value = true;
    return;
  }
  settingsOpen.value = true;
}

function resetCamera(): void {
  store.resetCamera();
  mobileMenuOpen.value = false;
}

function exportFromMobileMenu(): void {
  mobileMenuOpen.value = false;
  void exportPng();
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
  <main
    class="viewer"
    :class="{ 'has-controls': !isMobile && controlsVisible, 'is-mobile': isMobile }"
  >
    <section class="stage" aria-label="Область просмотра фрактала">
      <FractalCanvas ref="fractalCanvas" />

      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Fractal Lab</span>
        </div>
      </header>

      <button
        v-if="!isMobile"
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
    </section>

    <ControlPanel
      v-if="!isMobile && controlsVisible"
      :exporting="exporting"
      @hide="controlsVisible = false"
      @export-png="exportPng"
    />

    <button
      v-if="!isMobile && !controlsVisible"
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

    <template v-if="isMobile">
      <button
        class="mobile-zoom-button"
        type="button"
        aria-label="Открыть точные координаты и масштаб"
        @click="coordinatesOpen = true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="5.75" />
          <path d="m15 15 4 4M10.5 8v5m-2.5-2.5h5" />
        </svg>
        <span>{{ zoomReadout }}</span>
      </button>

      <button
        v-if="mobileMenuOpen"
        class="mobile-menu-scrim"
        type="button"
        tabindex="-1"
        aria-label="Закрыть меню"
        @click="mobileMenuOpen = false"
      ></button>

      <nav
        class="mobile-action-menu"
        :class="{ 'is-open': mobileMenuOpen }"
        aria-label="Действия с фракталом"
      >
        <div class="mobile-action-list" :aria-hidden="!mobileMenuOpen">
          <a
            href="https://github.com/KostarSf/fractal-lab"
            target="_blank"
            rel="noreferrer"
            :tabindex="mobileMenuOpen ? 0 : -1"
            @click="mobileMenuOpen = false"
          >
            <span>Проект на GitHub</span>
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C5.8.1 4.7.5 4.7.5A5 5 0 0 0 4.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.5 6.8 7A4.8 4.8 0 0 0 9 18v4m0-3c-4.5 2-5-2-7-2"
                />
              </svg>
            </i>
          </a>
          <button
            type="button"
            :tabindex="mobileMenuOpen ? 0 : -1"
            @click="openMobileDialog('gallery')"
          >
            <span>Галерея фракталов</span>
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </i>
          </button>
          <button
            type="button"
            :tabindex="mobileMenuOpen ? 0 : -1"
            @click="openMobileDialog('settings')"
          >
            <span>Настройки фрактала</span>
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h10M4 12h16M4 17h10" />
                <circle cx="17" cy="7" r="2" />
                <circle cx="13" cy="17" r="2" />
              </svg>
            </i>
          </button>
          <button
            type="button"
            :disabled="exporting"
            :tabindex="mobileMenuOpen ? 0 : -1"
            @click="exportFromMobileMenu"
          >
            <span>{{ exporting ? "Готовим PNG…" : "Скриншот" }}</span>
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8 7 9.5 5h5L16 7h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </i>
          </button>
          <button type="button" :tabindex="mobileMenuOpen ? 0 : -1" @click="resetCamera">
            <span>Сбросить позицию</span>
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.9 6.8A8.5 8.5 0 1 1 3.6 15M4 4v4h4" />
              </svg>
            </i>
          </button>
        </div>

        <button
          class="mobile-menu-button"
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-label="Меню действий"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path class="menu-lines" d="M6 8h12M6 12h12M6 16h12" />
            <path class="menu-close" d="m7 7 10 10m0-10L7 17" />
          </svg>
        </button>
      </nav>
    </template>

    <CoordinatesDialog v-if="coordinatesOpen" @close="coordinatesOpen = false" />
    <FormulaPickerDialog v-if="formulaPickerOpen" @close="formulaPickerOpen = false" />
    <ControlPanel
      v-if="isMobile && settingsOpen"
      variant="dialog"
      :exporting="exporting"
      @hide="settingsOpen = false"
      @export-png="exportPng"
    />
  </main>
</template>
