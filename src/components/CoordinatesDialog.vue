<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { createCameraFromMagnification, magnificationForScale } from "../math/high-precision.ts";
import { useFractalStore } from "../stores/fractal.ts";

const emit = defineEmits<{
  close: [];
}>();

const store = useFractalStore();
const { activeFormula, exactCenter, exactScale } = storeToRefs(store);
const dialog = ref<HTMLDialogElement>();
const realInput = ref<HTMLInputElement>();
const real = ref(exactCenter.value[0]);
const imaginary = ref(exactCenter.value[1]);
const zoom = ref(magnificationForScale(activeFormula.value.initialView.scale, exactScale.value));
const errorMessage = ref("");
const copied = ref(false);
const coordinateLine = computed(
  () => `${real.value.trim()}, ${imaginary.value.trim()}, ${zoom.value.trim()}`,
);

onMounted(async () => {
  await nextTick();
  dialog.value?.showModal();
  realInput.value?.focus();
  realInput.value?.select();
});

function closeDialog(): void {
  if (dialog.value?.open) {
    dialog.value.close();
    return;
  }
  emit("close");
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) {
    closeDialog();
  }
}

function applyCamera(): void {
  errorMessage.value = "";

  try {
    const camera = createCameraFromMagnification(
      [real.value.trim(), imaginary.value.trim()],
      zoom.value.trim(),
      activeFormula.value.initialView.scale,
    );
    store.setExactCamera(camera);
    closeDialog();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Проверьте формат координат и масштаба.";
  }
}

async function copyCoordinates(): Promise<void> {
  errorMessage.value = "";

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(coordinateLine.value);
    } else {
      copyWithFallback(coordinateLine.value);
    }
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    try {
      copyWithFallback(coordinateLine.value);
      copied.value = true;
    } catch {
      errorMessage.value = "Не удалось скопировать строку. Выделите значения вручную.";
    }
  }
}

function copyWithFallback(value: string): void {
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copiedSuccessfully = document.execCommand("copy");
  input.remove();
  if (!copiedSuccessfully) {
    throw new Error("Clipboard API недоступен.");
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="coordinates-dialog"
      aria-labelledby="coordinates-title"
      @cancel.prevent="closeDialog"
      @click="handleBackdropClick"
      @close="emit('close')"
    >
      <form class="coordinates-shell" @submit.prevent="applyCamera">
        <header class="coordinates-header">
          <div>
            <span class="dialog-eyebrow">Точный переход</span>
            <h2 id="coordinates-title">Координаты и масштаб</h2>
            <p>Введите центр комплексной плоскости и увеличение относительно исходного вида.</p>
          </div>

          <button class="dialog-close" type="button" aria-label="Закрыть" @click="closeDialog">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.5 6.5 11 11m0-11-11 11" />
            </svg>
          </button>
        </header>

        <div class="coordinate-fields">
          <label>
            <span>Действительная часть · Re</span>
            <input
              ref="realInput"
              v-model="real"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              spellcheck="false"
            />
          </label>

          <label>
            <span>Мнимая часть · Im</span>
            <input
              v-model="imaginary"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              spellcheck="false"
            />
          </label>

          <label class="zoom-field">
            <span>Увеличение · Zoom</span>
            <span class="zoom-input">
              <input
                v-model="zoom"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                spellcheck="false"
              />
              <i>×</i>
            </span>
          </label>
        </div>

        <p v-if="errorMessage" class="coordinate-error" role="alert">{{ errorMessage }}</p>

        <div class="coordinate-line">
          <code>{{ coordinateLine }}</code>
          <button type="button" @click="copyCoordinates">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="8" y="8" width="10" height="10" rx="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
            </svg>
            {{ copied ? "Скопировано" : "Копировать строку" }}
          </button>
        </div>

        <footer class="coordinate-actions">
          <button class="secondary-action" type="button" @click="closeDialog">Отмена</button>
          <button class="primary-action" type="submit">Перейти к виду</button>
        </footer>
      </form>
    </dialog>
  </Teleport>
</template>

<style scoped>
.coordinates-dialog {
  width: min(620px, calc(100vw - 32px));
  max-width: none;
  padding: 0;
  overflow: visible;
  border: 0;
  outline: 0;
  color: #f2f0f6;
  background: transparent;
}

.coordinates-dialog::backdrop {
  background: rgb(3 4 8 / 72%);
  backdrop-filter: blur(11px) saturate(0.82);
}

.coordinates-shell {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 20px;
  background:
    radial-gradient(circle at 12% 0%, rgb(119 91 191 / 17%), transparent 38%), rgb(15 16 22 / 96%);
  box-shadow: 0 28px 100px rgb(0 0 0 / 62%);
}

.coordinates-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 30px 32px 24px;
}

.dialog-eyebrow {
  display: block;
  margin-bottom: 9px;
  color: #817a91;
  font: 9px/1 var(--mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.coordinates-header h2 {
  margin: 0;
  font-size: 25px;
  font-weight: 480;
  letter-spacing: -0.04em;
}

.coordinates-header p {
  max-width: 440px;
  margin: 9px 0 0;
  color: rgb(255 255 255 / 43%);
  font-size: 11px;
  line-height: 1.55;
}

.dialog-close {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
  place-items: center;
  color: rgb(255 255 255 / 53%);
  background: rgb(255 255 255 / 3%);
}

.dialog-close svg {
  width: 15px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.coordinate-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 0 32px;
}

.coordinate-fields label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 9px;
  color: #9896a2;
  font-size: 10px;
  font-weight: 500;
}

.coordinate-fields input {
  width: 100%;
  height: 43px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 8px;
  outline: 0;
  color: #e7e4ed;
  background: rgb(255 255 255 / 4%);
  font: 11px/1 var(--mono);
}

.coordinate-fields input:focus {
  border-color: rgb(192 174 255 / 54%);
  box-shadow: 0 0 0 3px rgb(182 156 255 / 8%);
}

.zoom-field {
  grid-column: 1 / -1;
}

.zoom-input {
  position: relative;
}

.zoom-input input {
  padding-right: 42px;
}

.zoom-input i {
  position: absolute;
  top: 50%;
  right: 14px;
  color: #777381;
  font: normal 12px/1 var(--mono);
  transform: translateY(-50%);
}

.coordinate-error {
  margin: 14px 32px 0;
  color: #ffaaaa;
  font-size: 10px;
  line-height: 1.45;
}

.coordinate-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 32px 0;
  padding: 11px 11px 11px 13px;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 9px;
  background: rgb(4 5 9 / 34%);
}

.coordinate-line code {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #85828f;
  font: 9px/1.4 var(--mono);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coordinate-line button {
  display: flex;
  height: 30px;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  border: 1px solid rgb(182 156 255 / 22%);
  border-radius: 6px;
  color: #bfb1e9;
  background: rgb(182 156 255 / 7%);
  font-size: 9px;
}

.coordinate-line svg {
  width: 13px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.coordinate-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 25px;
  padding: 18px 32px;
  border-top: 1px solid rgb(255 255 255 / 8%);
  background: rgb(255 255 255 / 1.5%);
}

.coordinate-actions button {
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 550;
}

.secondary-action {
  border: 1px solid rgb(255 255 255 / 10%);
  color: #8d8a96;
  background: transparent;
}

.primary-action {
  border: 1px solid rgb(200 185 255 / 30%);
  color: #17131f;
  background: #cbbcff;
}

button:focus-visible {
  outline: 2px solid rgb(192 174 255 / 72%);
  outline-offset: 2px;
}

@media (max-width: 560px) {
  .coordinates-header,
  .coordinate-actions {
    padding-right: 20px;
    padding-left: 20px;
  }

  .coordinate-fields {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .zoom-field {
    grid-column: auto;
  }

  .coordinate-line {
    align-items: stretch;
    flex-direction: column;
    margin-right: 20px;
    margin-left: 20px;
  }

  .coordinate-line button {
    justify-content: center;
  }
}
</style>
