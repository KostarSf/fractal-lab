<script setup lang="ts">
import { storeToRefs } from "pinia";
import { FRACTAL_FORMULAS } from "../fractals/formulas.ts";
import { useFractalStore } from "../stores/fractal.ts";

const store = useFractalStore();
const { activeFormula, colorDensity, maxIterations, palette, parameterValues } = storeToRefs(store);

function eventValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

function eventNumber(event: Event): number | undefined {
  const value = Number(eventValue(event));
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
    </div>

    <div class="control-stack">
      <label class="field">
        <span>Формула</span>
        <span class="select-wrap">
          <select
            id="formula-select"
            :value="activeFormula.id"
            @change="store.selectFormula(eventValue($event))"
          >
            <option v-for="formula in FRACTAL_FORMULAS" :key="formula.id" :value="formula.id">
              {{ formula.label }}
            </option>
          </select>
        </span>
      </label>
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
              :value="numberParameter(parameter.key)"
              @input="updateNumberParameter(parameter.key, $event)"
            />
          </span>
        </label>
      </div>

      <div class="section-rule"></div>

      <label class="field range-field">
        <span>
          <span>Итерации</span>
          <output for="iterations">{{ maxIterations }}</output>
        </span>
        <input
          id="iterations"
          v-model.number="maxIterations"
          type="range"
          min="40"
          max="1500"
          step="10"
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

      <label class="field range-field">
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
      <span>GPU escape-time renderer</span>
    </footer>
  </aside>
</template>
