import "./style.css";
import { createDefaultParameters, FRACTAL_FORMULAS } from "./fractals/formulas.ts";
import type { ComplexValue, FractalFormula, FractalParameterValue } from "./fractals/types.ts";
import { FractalRenderer } from "./renderer/fractal-renderer.ts";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Корневой элемент #app не найден.");
}

app.innerHTML = `
  <main class="viewer">
    <section class="stage" aria-label="Область просмотра фрактала">
      <canvas id="fractal-canvas" aria-label="Визуализация фрактала"></canvas>

      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Fractal Lab</span>
        </div>
        <div class="coordinates" aria-live="polite">
          <span id="zoom-readout">1×</span>
          <span class="coordinate-divider"></span>
          <span id="center-readout">−0.650000 + 0.000000i</span>
        </div>
      </header>

      <div class="gesture-hint">
        <span class="desktop-hint">Перетаскивание — перемещение</span>
        <span class="desktop-hint">Колесо — масштаб</span>
        <span class="mobile-hint">Один палец — перемещение · два — масштаб</span>
      </div>

      <div id="render-error" class="render-error" hidden>
        <strong>Не удалось запустить GPU-рендерер</strong>
        <span id="render-error-message"></span>
      </div>
    </section>

    <aside class="controls" aria-label="Настройки фрактала">
      <div class="controls-heading">
        <div>
          <span class="eyebrow">Исследование</span>
          <h1>Параметры</h1>
        </div>
        <button id="reset-view" class="icon-button" type="button" aria-label="Сбросить вид" title="Сбросить вид">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.9 6.8A8.5 8.5 0 1 1 3.6 15M4 4v4h4"/>
          </svg>
        </button>
      </div>

      <div class="control-stack">
        <label class="field">
          <span>Формула</span>
          <span class="select-wrap">
            <select id="formula-select"></select>
          </span>
        </label>
        <p id="formula-description" class="formula-description"></p>

        <div id="formula-parameters" class="formula-parameters"></div>

        <div class="section-rule"></div>

        <label class="field range-field">
          <span>
            <span>Итерации</span>
            <output id="iterations-output" for="iterations">320</output>
          </span>
          <input id="iterations" type="range" min="40" max="1500" step="10" />
        </label>

        <label class="field">
          <span>Палитра</span>
          <span class="select-wrap">
            <select id="palette-select">
              <option value="0">Ultraviolet</option>
              <option value="1">Electric tide</option>
              <option value="2">Solar flare</option>
              <option value="3">Arctic dusk</option>
            </select>
          </span>
        </label>

        <label class="field range-field">
          <span>
            <span>Плотность цвета</span>
            <output id="density-output" for="color-density">0.075</output>
          </span>
          <input id="color-density" type="range" min="0.015" max="0.2" step="0.005" value="0.075" />
        </label>
      </div>

      <footer class="controls-footer">
        <span class="gpu-status"><i aria-hidden="true"></i> WebGL2</span>
        <span>GPU escape-time renderer</span>
      </footer>
    </aside>
  </main>
`;

const canvas = getElement<HTMLCanvasElement>("fractal-canvas");
const formulaSelect = getElement<HTMLSelectElement>("formula-select");
const formulaDescription = getElement<HTMLParagraphElement>("formula-description");
const formulaParameters = getElement<HTMLDivElement>("formula-parameters");
const iterationsInput = getElement<HTMLInputElement>("iterations");
const iterationsOutput = getElement<HTMLOutputElement>("iterations-output");
const paletteSelect = getElement<HTMLSelectElement>("palette-select");
const densityInput = getElement<HTMLInputElement>("color-density");
const densityOutput = getElement<HTMLOutputElement>("density-output");
const zoomReadout = getElement<HTMLSpanElement>("zoom-readout");
const centerReadout = getElement<HTMLSpanElement>("center-readout");
const resetViewButton = getElement<HTMLButtonElement>("reset-view");
const renderError = getElement<HTMLDivElement>("render-error");
const renderErrorMessage = getElement<HTMLSpanElement>("render-error-message");

let activeFormula = FRACTAL_FORMULAS[0]!;
let center: [number, number] = [...activeFormula.initialView.center];
let scale = activeFormula.initialView.scale;
let maxIterations = activeFormula.suggestedIterations;
let palette = 0;
let colorDensity = 0.075;
let colorOffset = 0;
let parameterValues = createDefaultParameters(activeFormula);
let quality = 1;
let renderFrame: number | undefined;
let interactionTimer: number | undefined;
let renderer: FractalRenderer | undefined;

for (const formula of FRACTAL_FORMULAS) {
  const option = document.createElement("option");
  option.value = formula.id;
  option.textContent = formula.label;
  formulaSelect.append(option);
}

try {
  renderer = new FractalRenderer(canvas);
  renderer.setFormula(activeFormula);
} catch (error) {
  renderError.hidden = false;
  renderErrorMessage.textContent = error instanceof Error ? error.message : String(error);
}

syncFormulaUi();
scheduleRender();

formulaSelect.addEventListener("change", () => {
  const formula = FRACTAL_FORMULAS.find((candidate) => candidate.id === formulaSelect.value);
  if (!formula || !renderer) {
    return;
  }

  try {
    renderer.setFormula(formula);
  } catch (error) {
    renderError.hidden = false;
    renderErrorMessage.textContent = error instanceof Error ? error.message : String(error);
    return;
  }

  activeFormula = formula;
  parameterValues = createDefaultParameters(formula);
  resetCamera();
  syncFormulaUi();
  scheduleRender();
});

iterationsInput.addEventListener("input", () => {
  maxIterations = Number(iterationsInput.value);
  iterationsOutput.value = String(maxIterations);
  beginBriefInteraction();
});

paletteSelect.addEventListener("change", () => {
  palette = Number(paletteSelect.value);
  scheduleRender();
});

densityInput.addEventListener("input", () => {
  colorDensity = Number(densityInput.value);
  densityOutput.value = colorDensity.toFixed(3);
  beginBriefInteraction();
});

resetViewButton.addEventListener("click", () => {
  resetCamera();
  colorOffset = 0;
  scheduleRender();
});

const activePointers = new Map<number, readonly [x: number, y: number]>();

canvas.addEventListener("pointerdown", (event) => {
  if ((event.pointerType === "mouse" && event.button !== 0) || activePointers.size >= 2) {
    return;
  }

  activePointers.set(event.pointerId, [event.clientX, event.clientY]);
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add("is-dragging");
  quality = 0.58;
});

canvas.addEventListener("pointermove", (event) => {
  const previousPosition = activePointers.get(event.pointerId);
  if (!previousPosition) {
    return;
  }

  if (activePointers.size === 1) {
    const height = Math.max(canvas.clientHeight, 1);
    center[0] -= ((event.clientX - previousPosition[0]) / height) * scale;
    center[1] += ((event.clientY - previousPosition[1]) / height) * scale;
    activePointers.set(event.pointerId, [event.clientX, event.clientY]);
  } else {
    const previousGesture = getGestureMetrics();
    activePointers.set(event.pointerId, [event.clientX, event.clientY]);
    const nextGesture = getGestureMetrics();

    if (previousGesture && nextGesture && nextGesture.distance > 0) {
      const anchor = screenToComplex(previousGesture.midpoint[0], previousGesture.midpoint[1]);
      const nextScale = Math.max(
        1e-12,
        Math.min(8, scale * (previousGesture.distance / nextGesture.distance)),
      );
      const normalized = screenToNormalized(nextGesture.midpoint[0], nextGesture.midpoint[1]);
      center[0] = anchor[0] - normalized[0] * nextScale;
      center[1] = anchor[1] - normalized[1] * nextScale;
      scale = nextScale;
    }
  }

  scheduleRender();
});

const finishDrag = (event: PointerEvent): void => {
  if (!activePointers.delete(event.pointerId)) {
    return;
  }

  canvas.classList.toggle("is-dragging", activePointers.size > 0);
  if (activePointers.size === 0) {
    quality = 1;
  }
  scheduleRender();
};

canvas.addEventListener("pointerup", finishDrag);
canvas.addEventListener("pointercancel", finishDrag);

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const anchor = screenToComplex(event.clientX, event.clientY);
    const factor = Math.exp(Math.max(-120, Math.min(120, event.deltaY)) * 0.002);
    const nextScale = Math.max(1e-12, Math.min(8, scale * factor));
    const ratio = nextScale / scale;

    center[0] = anchor[0] + (center[0] - anchor[0]) * ratio;
    center[1] = anchor[1] + (center[1] - anchor[1]) * ratio;
    scale = nextScale;
    beginBriefInteraction();
  },
  { passive: false },
);

canvas.addEventListener("dblclick", (event) => {
  const anchor = screenToComplex(event.clientX, event.clientY);
  const ratio = 0.45;
  center[0] = anchor[0] + (center[0] - anchor[0]) * ratio;
  center[1] = anchor[1] + (center[1] - anchor[1]) * ratio;
  scale *= ratio;
  beginBriefInteraction();
});

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    return;
  }

  const panStep = scale * 0.08;
  if (event.key === "ArrowLeft") center[0] -= panStep;
  else if (event.key === "ArrowRight") center[0] += panStep;
  else if (event.key === "ArrowUp") center[1] += panStep;
  else if (event.key === "ArrowDown") center[1] -= panStep;
  else if (event.key === "+" || event.key === "=") scale *= 0.8;
  else if (event.key === "-") scale *= 1.25;
  else return;

  event.preventDefault();
  beginBriefInteraction();
});

const resizeObserver = new ResizeObserver(() => scheduleRender());
resizeObserver.observe(canvas);

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Элемент #${id} не найден.`);
  }
  return element as T;
}

function resetCamera(): void {
  center = [...activeFormula.initialView.center];
  scale = activeFormula.initialView.scale;
}

function syncFormulaUi(): void {
  formulaSelect.value = activeFormula.id;
  formulaDescription.textContent = activeFormula.description;
  maxIterations = activeFormula.suggestedIterations;
  iterationsInput.value = String(maxIterations);
  iterationsOutput.value = String(maxIterations);
  renderParameterControls(activeFormula);
}

function renderParameterControls(formula: FractalFormula): void {
  formulaParameters.replaceChildren();
  if (formula.parameters.length === 0) {
    return;
  }

  const rule = document.createElement("div");
  rule.className = "section-rule";
  formulaParameters.append(rule);

  for (const parameter of formula.parameters) {
    const field = document.createElement("label");
    field.className = "field";

    const label = document.createElement("span");
    label.textContent = parameter.label;
    field.append(label);

    if (parameter.type === "complex") {
      const value = parameterValues.get(parameter.key);
      if (!Array.isArray(value)) {
        continue;
      }

      const pair = document.createElement("span");
      pair.className = "complex-pair";
      pair.append(
        createNumberInput(value[0], parameter.step, "Re", (nextValue) => {
          const current = parameterValues.get(parameter.key);
          if (!Array.isArray(current)) return;
          updateParameter(parameter.key, [nextValue, current[1]]);
        }),
        createNumberInput(value[1], parameter.step, "Im", (nextValue) => {
          const current = parameterValues.get(parameter.key);
          if (!Array.isArray(current)) return;
          updateParameter(parameter.key, [current[0], nextValue]);
        }),
      );
      field.append(pair);
    } else {
      const value = parameterValues.get(parameter.key);
      if (typeof value !== "number") {
        continue;
      }
      field.append(
        createNumberInput(value, parameter.step, "", (nextValue) => {
          updateParameter(parameter.key, nextValue);
        }),
      );
    }

    formulaParameters.append(field);
  }
}

function createNumberInput(
  value: number,
  step: number,
  prefix: string,
  onChange: (value: number) => void,
): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = "number-input";

  if (prefix) {
    const adornment = document.createElement("span");
    adornment.textContent = prefix;
    wrapper.append(adornment);
  }

  const input = document.createElement("input");
  input.type = "number";
  input.step = String(step);
  input.value = String(value);
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  });
  wrapper.append(input);
  return wrapper;
}

function updateParameter(key: string, value: FractalParameterValue): void {
  parameterValues = new Map(parameterValues).set(key, value);
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
    if (!renderer || canvas.clientWidth === 0 || canvas.clientHeight === 0) {
      return;
    }

    renderer.resize(quality);
    renderer.render({
      center,
      scale,
      maxIterations,
      palette,
      colorDensity,
      colorOffset,
      parameters: parameterValues,
    });
    updateReadouts();
  });
}

function screenToComplex(clientX: number, clientY: number): ComplexValue {
  const normalized = screenToNormalized(clientX, clientY);
  return [center[0] + normalized[0] * scale, center[1] + normalized[1] * scale];
}

function screenToNormalized(clientX: number, clientY: number): ComplexValue {
  const bounds = canvas.getBoundingClientRect();
  const normalizedX = (clientX - bounds.left - bounds.width * 0.5) / bounds.height;
  const normalizedY = (bounds.height * 0.5 - (clientY - bounds.top)) / bounds.height;
  return [normalizedX, normalizedY];
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

function updateReadouts(): void {
  const zoom = activeFormula.initialView.scale / scale;
  zoomReadout.textContent = `${formatZoom(zoom)}×`;
  centerReadout.textContent = `${formatCoordinate(center[0])} ${center[1] < 0 ? "−" : "+"} ${formatCoordinate(Math.abs(center[1]))}i`;
}

function formatZoom(value: number): string {
  if (value >= 1_000_000) return value.toExponential(2);
  if (value >= 100) return Math.round(value).toLocaleString("ru-RU");
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function formatCoordinate(value: number): string {
  const digits = Math.max(6, Math.min(12, Math.ceil(-Math.log10(scale)) + 3));
  return value.toFixed(digits).replace("-", "−");
}
