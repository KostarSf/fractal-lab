<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { FractalFormula } from "../fractals/types.ts";
import { getFractalPreview } from "../renderer/fractal-preview-service.ts";

const props = defineProps<{
  formula: FractalFormula;
}>();

const root = ref<HTMLElement>();
const previewUrl = ref("");
const status = ref<"idle" | "loading" | "ready" | "error">("idle");

let observer: IntersectionObserver | undefined;
let disposed = false;

onMounted(() => {
  if (!root.value || !("IntersectionObserver" in window)) {
    void loadPreview();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }
      observer?.disconnect();
      observer = undefined;
      void loadPreview();
    },
    { rootMargin: "240px" },
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  disposed = true;
  observer?.disconnect();
});

async function loadPreview(): Promise<void> {
  if (status.value !== "idle") {
    return;
  }
  status.value = "loading";

  try {
    const url = await getFractalPreview(props.formula);
    if (!disposed) {
      previewUrl.value = url;
      status.value = "ready";
    }
  } catch {
    if (!disposed) {
      status.value = "error";
    }
  }
}
</script>

<template>
  <span ref="root" class="fractal-preview" :data-status="status" aria-hidden="true">
    <img v-if="previewUrl" :src="previewUrl" alt="" />
    <span v-else-if="status === 'error'" class="preview-error">
      <svg viewBox="0 0 24 24">
        <path d="M6.5 17.5 17.5 6.5M6.5 6.5l11 11" />
      </svg>
      Превью недоступно
    </span>
    <span v-else class="preview-loader">
      <i></i>
      <i></i>
      <i></i>
    </span>
  </span>
</template>

<style scoped>
.fractal-preview {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 22%, rgb(134 109 223 / 23%), transparent 36%),
    linear-gradient(145deg, #161722, #090a0f);
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: preview-arrive 420ms ease-out both;
}

.preview-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.preview-loader i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(215 203 255 / 65%);
  animation: preview-pulse 900ms ease-in-out infinite alternate;
}

.preview-loader i:nth-child(2) {
  animation-delay: 160ms;
}

.preview-loader i:nth-child(3) {
  animation-delay: 320ms;
}

.preview-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: rgb(255 255 255 / 38%);
  font-size: 9px;
}

.preview-error svg {
  width: 18px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
}

@keyframes preview-pulse {
  from {
    opacity: 0.2;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@keyframes preview-arrive {
  from {
    opacity: 0;
    transform: scale(1.025);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  img,
  .preview-loader i {
    animation: none;
  }
}
</style>
