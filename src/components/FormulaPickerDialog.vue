<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { FRACTAL_FORMULAS } from "../fractals/formulas.ts";
import type { FractalFormula } from "../fractals/types.ts";
import { useFractalStore } from "../stores/fractal.ts";
import FractalPreview from "./FractalPreview.vue";

type FormulaCategory = FractalFormula["renderer"];

const emit = defineEmits<{
  close: [];
}>();

const store = useFractalStore();
const { activeFormula } = storeToRefs(store);
const dialog = ref<HTMLDialogElement>();
const searchInput = ref<HTMLInputElement>();
const query = ref("");
const category = ref<"all" | FormulaCategory>("all");

const filteredFormulas = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase("ru");
  return FRACTAL_FORMULAS.filter((formula) => {
    const matchesCategory = category.value === "all" || formula.renderer === category.value;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${formula.label} ${formula.description}`.toLocaleLowerCase("ru").includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
});

onMounted(async () => {
  await nextTick();
  dialog.value?.showModal();
  searchInput.value?.focus();
});

function closeDialog(): void {
  if (dialog.value?.open) {
    dialog.value.close();
    return;
  }
  emit("close");
}

function selectFormula(formulaId: string): void {
  store.selectFormula(formulaId);
  closeDialog();
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) {
    closeDialog();
  }
}

function categoryLabel(formula: FractalFormula): string {
  if (formula.renderer === "root-basin") {
    return "Root basin";
  }
  if (formula.renderer === "point-attractor") {
    return "Attractor";
  }
  if (formula.renderer === "geometric-ifs") {
    return "Geometric IFS";
  }
  return "Escape time";
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="formula-picker"
      aria-labelledby="formula-picker-title"
      @cancel.prevent="closeDialog"
      @click="handleBackdropClick"
      @close="emit('close')"
    >
      <section class="picker-shell">
        <header class="picker-header">
          <div class="picker-heading">
            <h2 id="formula-picker-title">Каталог фракталов</h2>
            <p>Формулы, геометрические IFS, бассейны и странные аттракторы</p>
          </div>

          <button class="picker-close" type="button" aria-label="Закрыть" @click="closeDialog">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.5 6.5 11 11m0-11-11 11" />
            </svg>
          </button>
        </header>

        <div class="navigator-tools">
          <label class="formula-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="5.75" />
              <path d="m15 15 4 4" />
            </svg>
            <input
              ref="searchInput"
              v-model="query"
              type="search"
              placeholder="Название или описание…"
              aria-label="Поиск формулы"
            />
            <kbd>Esc</kbd>
          </label>

          <div class="category-filters" aria-label="Категория формулы">
            <button
              v-for="filter in [
                ['all', 'Все'],
                ['escape-time', 'Escape'],
                ['root-basin', 'Basins'],
                ['point-attractor', 'Attractors'],
                ['geometric-ifs', 'IFS'],
              ] as const"
              :key="filter[0]"
              type="button"
              :aria-pressed="category === filter[0]"
              @click="category = filter[0]"
            >
              {{ filter[1] }}
            </button>
          </div>
        </div>

        <div class="formula-grid" :aria-label="`Доступно формул: ${filteredFormulas.length}`">
          <button
            v-for="(formula, index) in filteredFormulas"
            :key="formula.id"
            class="formula-card"
            :class="{ 'is-active': formula.id === activeFormula.id }"
            :data-renderer="formula.renderer"
            type="button"
            :aria-pressed="formula.id === activeFormula.id"
            @click="selectFormula(formula.id)"
          >
            <span class="card-visual">
              <FractalPreview :formula="formula" />
              <span class="card-index">{{ String(index + 1).padStart(2, "0") }}</span>
              <span v-if="formula.id === activeFormula.id" class="active-badge">
                <i></i>
                Открыт
              </span>
            </span>

            <span class="card-copy">
              <span class="card-category">{{ categoryLabel(formula) }}</span>
              <strong>{{ formula.label }}</strong>
              <span class="card-description">{{ formula.description }}</span>
            </span>
          </button>
        </div>

        <div v-if="filteredFormulas.length === 0" class="empty-results">
          <span>∅</span>
          По такому запросу формул пока нет
        </div>
      </section>
    </dialog>
  </Teleport>
</template>

<style scoped>
.formula-picker {
  width: min(1180px, calc(100vw - 48px));
  max-width: none;
  height: min(840px, calc(100dvh - 48px));
  max-height: none;
  padding: 0;
  overflow: hidden;
  border: 0;
  outline: 0;
  color: #f4f2f8;
  background: transparent;
}

.formula-picker::backdrop {
  background: rgb(3 4 8 / 78%);
  backdrop-filter: blur(12px) saturate(0.8);
  animation: backdrop-arrive 220ms ease-out both;
}

.picker-shell {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 20px;
  background:
    radial-gradient(circle at 8% 0%, rgb(119 91 191 / 17%), transparent 34%),
    radial-gradient(circle at 92% 95%, rgb(49 83 151 / 11%), transparent 37%), #101117;
  box-shadow: 0 28px 100px rgb(0 0 0 / 62%);
  animation: dialog-arrive 260ms cubic-bezier(0.2, 0.75, 0.3, 1) both;
}

.picker-header {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  padding: 32px 36px 24px;
}

.picker-heading {
  min-width: 0;
}

.picker-heading h2 {
  margin: 0;
  color: inherit;
  font-size: clamp(25px, 3vw, 36px);
  font-weight: 450;
  letter-spacing: -0.045em;
}

.picker-heading p {
  margin: 9px 0 0;
  color: rgb(255 255 255 / 42%);
  font-size: 11px;
}

.picker-close {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
  place-items: center;
  color: rgb(255 255 255 / 53%);
  background: rgb(255 255 255 / 3%);
  transition:
    color 150ms ease,
    border-color 150ms ease,
    transform 150ms ease;
}

.picker-close:hover {
  border-color: rgb(192 174 255 / 36%);
  color: white;
  transform: rotate(5deg);
}

.picker-close svg {
  width: 16px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.navigator-tools {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 36px 26px;
}

.formula-search {
  display: flex;
  width: min(560px, 100%);
  height: 46px;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 9px;
  background: rgb(255 255 255 / 3%);
  transition:
    border-color 150ms ease,
    background 150ms ease;
}

.formula-search:focus-within {
  border-color: rgb(192 174 255 / 48%);
  background: rgb(182 156 255 / 5%);
}

.formula-search svg {
  width: 16px;
  flex: 0 0 auto;
  fill: none;
  stroke: #827b91;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.formula-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #ece9f3;
  background: transparent;
  font: 11px/1 var(--mono);
}

.formula-search input::placeholder {
  color: #5f5d69;
}

.formula-search kbd {
  padding: 4px 6px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 4px;
  color: #6f6d79;
  background: rgb(255 255 255 / 3%);
  font: 8px/1 var(--mono);
}

.category-filters {
  display: flex;
  align-items: center;
  gap: 7px;
}

.category-filters button {
  height: 34px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #74717e;
  background: transparent;
  font: 8px/1 var(--mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition:
    border-color 150ms ease,
    color 150ms ease,
    background 150ms ease;
}

.category-filters button:hover {
  color: #c5bfce;
}

.category-filters button[aria-pressed="true"] {
  border-color: rgb(182 156 255 / 28%);
  color: #d1c2ff;
  background: rgb(182 156 255 / 8%);
}

.formula-grid {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: max-content;
  align-content: start;
  gap: 12px;
  padding: 0 36px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: rgb(255 255 255 / 16%) transparent;
  scrollbar-width: thin;
}

.formula-card {
  position: relative;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 11px;
  color: inherit;
  text-align: left;
  background: rgb(255 255 255 / 2%);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.formula-card:hover {
  border-color: rgb(187 165 255 / 40%);
  background: rgb(255 255 255 / 4%);
  box-shadow: 0 10px 30px rgb(0 0 0 / 25%);
  transform: translateY(-2px);
}

.formula-card:focus-visible,
.picker-close:focus-visible,
.formula-search:focus-within,
.category-filters button:focus-visible {
  outline: 2px solid rgb(192 174 255 / 72%);
  outline-offset: 2px;
}

.formula-card.is-active {
  border-color: rgb(187 165 255 / 62%);
  box-shadow: inset 0 0 0 1px rgb(187 165 255 / 12%);
}

.card-visual {
  position: relative;
  display: block;
  aspect-ratio: 1.65;
  overflow: hidden;
  border-bottom: 1px solid rgb(255 255 255 / 7%);
}

.card-visual::after {
  position: absolute;
  content: "";
  inset: 48% 0 0;
  background: linear-gradient(transparent, rgb(9 10 15 / 42%));
  pointer-events: none;
}

.card-visual :deep(img) {
  transition: transform 450ms cubic-bezier(0.2, 0.65, 0.3, 1);
}

.formula-card:hover .card-visual :deep(img) {
  transform: scale(1.035);
}

.card-index {
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 13px;
  color: rgb(255 255 255 / 72%);
  font: 9px/1 var(--mono);
  text-shadow: 0 1px 8px #000;
}

.active-badge {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 999px;
  color: rgb(255 255 255 / 78%);
  background: rgb(7 8 13 / 72%);
  backdrop-filter: blur(8px);
  font: 8px/1 var(--mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.active-badge i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #bfaaff;
  box-shadow: 0 0 7px #bfaaff;
}

.card-copy,
.card-description,
.card-category {
  display: block;
}

.card-copy {
  padding: 15px 16px 17px;
}

.card-category {
  color: #8f80b0;
  font: 8px/1 var(--mono);
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.card-copy strong {
  display: block;
  margin-top: 9px;
  overflow: hidden;
  color: #f1eff6;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-description {
  display: -webkit-box;
  min-height: 31px;
  margin-top: 8px;
  overflow: hidden;
  color: rgb(255 255 255 / 42%);
  font-size: 8px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.empty-results {
  display: flex;
  min-height: 220px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgb(255 255 255 / 36%);
  font-size: 11px;
}

.empty-results span {
  color: rgb(255 255 255 / 18%);
  font: 36px/1 var(--mono);
}

@keyframes backdrop-arrive {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes dialog-arrive {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 950px) {
  .formula-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .navigator-tools {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .formula-search {
    width: 100%;
  }
}

@media (max-width: 650px) {
  .formula-search input {
    font-size: 16px;
  }

  .formula-picker {
    width: calc(100vw - 16px);
    height: calc(100dvh - 16px);
  }

  .picker-shell {
    border-radius: 12px;
  }

  .picker-header {
    padding: 22px 18px 18px;
  }

  .picker-heading h2 {
    font-size: 24px;
  }

  .picker-heading p {
    font-size: 10px;
  }

  .navigator-tools {
    padding: 0 18px 20px;
  }

  .category-filters {
    overflow-x: auto;
  }

  .formula-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0 18px 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .picker-shell,
  .formula-picker::backdrop {
    animation: none;
  }
}
</style>
