<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useFractalStore } from "../stores/fractal.ts";
import FormulaPickerDialog from "./FormulaPickerDialog.vue";

defineProps<{
  exporting: boolean;
}>();

const emit = defineEmits<{
  exportPng: [];
  hide: [];
}>();

const store = useFractalStore();
const {
  activeFormula,
  colorDensity,
  geometricColoring,
  maxIterations,
  palette,
  parameterValues,
  recursionDepth,
  recursionDepthMode,
  smoothColors,
} = storeToRefs(store);
const geometricMode = computed(() => activeFormula.value.renderer === "geometric-ifs");
const maxRecursionDepth = computed(() =>
  activeFormula.value.renderer === "geometric-ifs"
    ? activeFormula.value.geometricIfs.recommendedMaxDepth
    : 32,
);
const pickerOpen = ref(false);

onMounted(() => {
  window.addEventListener("keydown", handleFormulaPickerShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleFormulaPickerShortcut);
});

function handleFormulaPickerShortcut(event: KeyboardEvent): void {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const hasPlatformModifier = isMac ? event.metaKey : event.ctrlKey;

  if (
    event.key.toLocaleLowerCase() !== "k" ||
    !hasPlatformModifier ||
    event.altKey ||
    event.shiftKey
  ) {
    return;
  }

  event.preventDefault();
  pickerOpen.value = true;
}

function eventValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

function eventNumber(event: Event): number | undefined {
  const rawValue = eventValue(event);
  if (rawValue.trim() === "") {
    return undefined;
  }
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : undefined;
}

function numberParameter(key: string): number {
  const value = parameterValues.value[key];
  return typeof value === "number" ? value : 0;
}

function complexParameter(key: string, component: 0 | 1): number {
  const value = parameterValues.value[key];
  return Array.isArray(value) ? value[component] : 0;
}

function updateNumberParameter(key: string, event: Event): void {
  const value = eventNumber(event);
  if (value !== undefined) {
    store.setParameter(key, value);
  }
}

function updateComplexParameter(key: string, component: 0 | 1, event: Event): void {
  const value = eventNumber(event);
  const current = parameterValues.value[key];
  if (value === undefined || !Array.isArray(current)) {
    return;
  }

  const next: [number, number] = [current[0], current[1]];
  next[component] = value;
  store.setParameter(key, next);
}
</script>

<template>
  <aside class="controls" aria-label="Настройки фрактала">
    <div class="controls-heading">
      <div>
        <span class="eyebrow">Исследование</span>
        <h1>Параметры</h1>
      </div>
      <div class="heading-actions">
        <button
          class="icon-button"
          type="button"
          aria-label="Сбросить вид"
          title="Сбросить вид"
          @click="store.resetCamera"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.9 6.8A8.5 8.5 0 1 1 3.6 15M4 4v4h4" />
          </svg>
        </button>
        <button
          class="icon-button"
          type="button"
          aria-label="Скрыть панель параметров"
          title="Скрыть панель"
          @click="emit('hide')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5 3 12l5 7M3.5 12H21" />
          </svg>
        </button>
      </div>
    </div>

    <div class="panel-actions">
      <button class="export-button" type="button" :disabled="exporting" @click="emit('exportPng')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12m-4-4 4 4 4-4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </svg>
        <span>
          <strong>{{ exporting ? "Готовим PNG…" : "Сохранить PNG" }}</strong>
          <small>Чистый рендер · разрешение 2×</small>
        </span>
        <i v-if="exporting" aria-hidden="true"></i>
      </button>
    </div>

    <div class="control-stack">
      <div class="field formula-picker-field">
        <span>Формула</span>
        <button
          class="formula-picker-button"
          type="button"
          aria-label="Открыть выбор формулы"
          @click="pickerOpen = true"
        >
          <span>{{ activeFormula.label }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m8 10 4 4 4-4" />
          </svg>
        </button>
      </div>
      <p class="formula-description">{{ activeFormula.description }}</p>

      <div
        v-if="activeFormula.parameters.length > 0"
        id="formula-parameters"
        class="formula-parameters"
      >
        <div class="section-rule"></div>

        <label v-for="parameter in activeFormula.parameters" :key="parameter.key" class="field">
          <span>{{ parameter.label }}</span>

          <span v-if="parameter.type === 'complex'" class="complex-pair">
            <span class="number-input">
              <span>Re</span>
              <input
                type="number"
                :step="parameter.step"
                :value="complexParameter(parameter.key, 0)"
                @input="updateComplexParameter(parameter.key, 0, $event)"
              />
            </span>
            <span class="number-input">
              <span>Im</span>
              <input
                type="number"
                :step="parameter.step"
                :value="complexParameter(parameter.key, 1)"
                @input="updateComplexParameter(parameter.key, 1, $event)"
              />
            </span>
          </span>

          <span v-else class="number-input">
            <input
              type="number"
              :step="parameter.step"
              :min="parameter.min"
              :max="parameter.max"
              :value="numberParameter(parameter.key)"
              @input="updateNumberParameter(parameter.key, $event)"
            />
          </span>
        </label>
      </div>

      <div class="section-rule"></div>

      <template v-if="geometricMode">
        <label class="field">
          <span>Глубина рекурсии</span>
          <span class="select-wrap">
            <select v-model="recursionDepthMode">
              <option value="auto">Auto · по масштабу</option>
              <option value="manual">Manual · фиксированная</option>
            </select>
          </span>
        </label>

        <label v-if="recursionDepthMode === 'manual'" class="field range-field">
          <span>
            <span>Количество уровней</span>
            <output for="recursion-depth">{{ recursionDepth }}</output>
          </span>
          <input
            id="recursion-depth"
            v-model.number="recursionDepth"
            type="range"
            min="1"
            :max="maxRecursionDepth"
            step="1"
          />
        </label>

        <label class="field">
          <span>Окрашивание</span>
          <span class="select-wrap">
            <select v-model="geometricColoring">
              <option value="solid">Однотонное</option>
              <option value="level">По уровню</option>
              <option value="gradient">Градиент</option>
            </select>
          </span>
        </label>
      </template>

      <label v-else-if="activeFormula.iterationControl" class="field range-field">
        <span>
          <span>{{ activeFormula.iterationControl.label }}</span>
          <output for="iterations">{{ maxIterations }}</output>
        </span>
        <input
          id="iterations"
          v-model.number="maxIterations"
          type="range"
          :min="activeFormula.iterationControl.min"
          :max="activeFormula.iterationControl.max"
          :step="activeFormula.iterationControl.step"
        />
      </label>

      <label class="field">
        <span>Палитра</span>
        <span class="select-wrap">
          <select v-model.number="palette">
            <option :value="0">Ultraviolet</option>
            <option :value="1">Electric tide</option>
            <option :value="2">Solar flare</option>
            <option :value="3">Arctic dusk</option>
          </select>
        </span>
      </label>

      <label
        v-if="activeFormula.renderer === 'escape-time' || activeFormula.renderer === 'root-basin'"
        class="toggle-field"
      >
        <span>
          <span>Сглаживание</span>
          <small>Плавные переходы между итерациями</small>
        </span>
        <input v-model="smoothColors" type="checkbox" role="switch" aria-label="Сглаживать цвета" />
      </label>

      <label
        v-if="activeFormula.renderer === 'escape-time' || activeFormula.renderer === 'root-basin'"
        class="field range-field"
      >
        <span>
          <span>Плотность цвета</span>
          <output for="color-density">{{ colorDensity.toFixed(3) }}</output>
        </span>
        <input
          id="color-density"
          v-model.number="colorDensity"
          type="range"
          min="0.015"
          max="0.2"
          step="0.005"
        />
      </label>
    </div>

    <footer class="controls-footer">
      <span class="gpu-status"><i aria-hidden="true"></i> WebGL2</span>
      <a
        href="https://github.com/KostarSf/fractal-lab"
        target="_blank"
        rel="noreferrer"
        aria-label="Открыть проект Fractal Lab на GitHub"
      >
        GitHub · KostarSf/fractal-lab
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 15 6-6m-4 0h4v4" />
        </svg>
      </a>
    </footer>

    <FormulaPickerDialog v-if="pickerOpen" @close="pickerOpen = false" />
  </aside>
</template>

<style scoped>
.heading-actions {
  display: flex;
  gap: 7px;
}

.panel-actions {
  padding: 0 20px 23px;
}

.export-button {
  display: flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border: 1px solid rgb(182 156 255 / 20%);
  border-radius: 10px;
  color: #bfb2e4;
  background:
    linear-gradient(135deg, rgb(182 156 255 / 9%), rgb(118 145 222 / 4%)), rgb(255 255 255 / 2%);
  text-align: left;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    transform 150ms ease;
}

.export-button:hover:not(:disabled) {
  border-color: rgb(182 156 255 / 38%);
  background:
    linear-gradient(135deg, rgb(182 156 255 / 14%), rgb(118 145 222 / 7%)), rgb(255 255 255 / 3%);
  transform: translateY(-1px);
}

.export-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.export-button > svg {
  width: 17px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.export-button > span {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.export-button strong {
  color: #d8cef3;
  font-size: 10px;
  font-weight: 550;
}

.export-button small {
  color: #706b7c;
  font: 8px/1 var(--mono);
}

.export-button > i {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  border: 1px solid rgb(216 206 243 / 25%);
  border-top-color: #d8cef3;
  border-radius: 50%;
  animation: export-spin 700ms linear infinite;
}

@keyframes export-spin {
  to {
    transform: rotate(360deg);
  }
}

.formula-picker-field {
  margin-bottom: 20px;
}

.formula-picker-button {
  display: flex;
  width: 100%;
  height: 38px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 11px 0 12px;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: #d2d1d8;
  background: var(--panel-raised);
  font-size: 11px;
  text-align: left;
  transition:
    border-color 150ms ease,
    color 150ms ease,
    background 150ms ease;
}

.formula-picker-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.formula-picker-button svg {
  width: 15px;
  flex: 0 0 auto;
  fill: none;
  stroke: #777883;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.formula-picker-button:hover {
  border-color: rgb(182 156 255 / 34%);
  color: var(--accent-bright);
  background: rgb(182 156 255 / 7%);
}

.formula-picker-button:focus-visible {
  outline: 2px solid rgb(182 156 255 / 72%);
  outline-offset: 2px;
}
</style>
