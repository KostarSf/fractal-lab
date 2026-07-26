import { CliffordTrajectoryClient } from "../attractors/clifford-client.ts";
import { createDefaultParameters } from "../fractals/formulas.ts";
import type { FractalFormula, FractalParameterValue } from "../fractals/types.ts";
import { BasinRenderer } from "./basin-renderer.ts";
import { CliffordRenderer } from "./clifford-renderer.ts";
import { FractalRenderer, type RenderState } from "./fractal-renderer.ts";

const PREVIEW_CACHE_NAME = "fractal-lab-previews-v4";
const PREVIEW_CACHE_VERSION = "renderer-v4";
const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 300;

const previewUrls = new Map<string, string>();
const previewJobs = new Map<string, Promise<string>>();

let renderQueue: Promise<void> = Promise.resolve();
let escapeCanvas: HTMLCanvasElement | undefined;
let escapeRenderer: FractalRenderer | undefined;
let basinCanvas: HTMLCanvasElement | undefined;
let basinRenderer: BasinRenderer | undefined;
let cliffordCanvas: HTMLCanvasElement | undefined;
let cliffordRenderer: CliffordRenderer | undefined;
let cliffordClient: CliffordTrajectoryClient | undefined;

export function getFractalPreview(formula: FractalFormula): Promise<string> {
  const key = `${PREVIEW_CACHE_VERSION}-${formula.id}`;
  const existingUrl = previewUrls.get(key);
  if (existingUrl) {
    return Promise.resolve(existingUrl);
  }

  const existingJob = previewJobs.get(key);
  if (existingJob) {
    return existingJob;
  }

  const job = loadOrRenderPreview(formula, key).catch((error: unknown) => {
    previewJobs.delete(key);
    throw error;
  });
  previewJobs.set(key, job);
  return job;
}

async function loadOrRenderPreview(formula: FractalFormula, key: string): Promise<string> {
  const cachedBlob = await readCachedPreview(key);
  const blob = cachedBlob ?? (await enqueueRender(() => renderPreview(formula)));

  if (!cachedBlob) {
    void writeCachedPreview(key, blob);
  }

  const url = URL.createObjectURL(blob);
  previewUrls.set(key, url);
  return url;
}

function enqueueRender(work: () => Promise<Blob>): Promise<Blob> {
  const job = renderQueue.then(waitForIdleFrame).then(work);
  renderQueue = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
}

function waitForIdleFrame(): Promise<void> {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 250 });
      return;
    }
    setTimeout(resolve, 16);
  });
}

async function renderPreview(formula: FractalFormula): Promise<Blob> {
  const parameters = {
    ...createDefaultParameters(formula),
    ...formula.preview.parameters,
  };

  if (formula.renderer === "escape-time") {
    const { canvas, renderer } = getEscapeRenderer();
    renderer.setFormula(formula);
    renderer.render(createPixelRenderState(formula, parameters));
    return canvasToBlob(canvas);
  }

  if (formula.renderer === "root-basin") {
    const { canvas, renderer } = getBasinRenderer();
    renderer.setFormula(formula);
    renderer.render(createPixelRenderState(formula, parameters));
    return canvasToBlob(canvas);
  }

  const { canvas, renderer, client } = getCliffordRenderer();
  const result = await client.request({
    a: numberParameter(parameters, "a", -1.4),
    b: numberParameter(parameters, "b", 1.6),
    c: numberParameter(parameters, "c", 1),
    d: numberParameter(parameters, "d", 0.7),
    burnIn: numberParameter(parameters, "burnIn", 100),
    pointCount: numberParameter(parameters, "pointCount", 180000),
  });
  renderer.setPoints(result.values);
  renderer.render({
    center: formula.preview.view.center,
    scale: formula.preview.view.scale,
    palette: formula.preview.palette ?? 0,
    colorOffset: formula.preview.colorOffset ?? 0,
    exposure: numberParameter(parameters, "exposure", 0.11),
    pointSize: numberParameter(parameters, "pointSize", 1.25),
    pointFraction: 1,
  });
  return canvasToBlob(canvas);
}

function createPixelRenderState(
  formula: FractalFormula,
  parameters: Readonly<Record<string, FractalParameterValue>>,
): RenderState {
  return {
    center: formula.preview.view.center,
    scale: formula.preview.view.scale,
    maxIterations: formula.preview.iterations ?? formula.suggestedIterations,
    palette: formula.preview.palette ?? 0,
    colorDensity: formula.preview.colorDensity ?? 0.075,
    colorOffset: formula.preview.colorOffset ?? 0,
    smoothColors: true,
    parameters,
  };
}

function getEscapeRenderer(): { canvas: HTMLCanvasElement; renderer: FractalRenderer } {
  if (!escapeCanvas || !escapeRenderer) {
    escapeCanvas = createPreviewCanvas();
    escapeRenderer = new FractalRenderer(escapeCanvas);
  }
  return { canvas: escapeCanvas, renderer: escapeRenderer };
}

function getBasinRenderer(): { canvas: HTMLCanvasElement; renderer: BasinRenderer } {
  if (!basinCanvas || !basinRenderer) {
    basinCanvas = createPreviewCanvas();
    basinRenderer = new BasinRenderer(basinCanvas);
  }
  return { canvas: basinCanvas, renderer: basinRenderer };
}

function getCliffordRenderer(): {
  canvas: HTMLCanvasElement;
  renderer: CliffordRenderer;
  client: CliffordTrajectoryClient;
} {
  if (!cliffordCanvas || !cliffordRenderer || !cliffordClient) {
    cliffordCanvas = createPreviewCanvas();
    cliffordRenderer = new CliffordRenderer(cliffordCanvas);
    cliffordClient = new CliffordTrajectoryClient();
  }
  return {
    canvas: cliffordCanvas,
    renderer: cliffordRenderer,
    client: cliffordClient,
  };
}

function createPreviewCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = PREVIEW_WIDTH;
  canvas.height = PREVIEW_HEIGHT;
  return canvas;
}

function numberParameter(
  parameters: Readonly<Record<string, FractalParameterValue>>,
  key: string,
  fallback: number,
): number {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Браузер не смог создать изображение превью."));
      },
      "image/webp",
      0.9,
    );
  });
}

async function readCachedPreview(key: string): Promise<Blob | undefined> {
  if (typeof caches === "undefined") {
    return undefined;
  }

  try {
    const cache = await caches.open(PREVIEW_CACHE_NAME);
    const response = await cache.match(cacheUrl(key));
    return response?.blob();
  } catch {
    return undefined;
  }
}

async function writeCachedPreview(key: string, blob: Blob): Promise<void> {
  if (typeof caches === "undefined") {
    return;
  }

  try {
    const cache = await caches.open(PREVIEW_CACHE_NAME);
    await cache.put(
      cacheUrl(key),
      new Response(blob, {
        headers: { "Content-Type": blob.type || "image/webp" },
      }),
    );
  } catch {
    // Persistent caching is an optional optimization.
  }
}

function cacheUrl(key: string): string {
  return new URL(`/__fractal-previews__/${encodeURIComponent(key)}.webp`, window.location.href)
    .href;
}
