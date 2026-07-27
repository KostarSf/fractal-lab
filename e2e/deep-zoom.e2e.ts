import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

interface DeepZoomScenario {
  readonly id: string;
  readonly label: string;
  readonly center: readonly [real: string, imaginary: string];
}

interface CanvasSample {
  readonly centroid: readonly [x: number, y: number];
  readonly gradientWeight: number;
  readonly luminance: readonly number[];
  readonly uniqueColors: number;
  readonly variance: number;
}

interface WebGlProbe {
  readonly contextLost: boolean;
  readonly error: number;
  readonly renderer: string;
  readonly version: string;
}

interface DeepZoomPerformanceProbe {
  readonly draws: readonly {
    readonly at: number;
    readonly disjoint?: boolean;
    readonly gpuMs?: number;
    readonly height: number;
    readonly colorDensity?: number;
    readonly maxIterations?: number;
    readonly timerAvailable: boolean;
    readonly width: number;
  }[];
  readonly referenceRequests: number;
  readonly referenceResults: readonly {
    readonly candidateCount: number | undefined;
    readonly durationMs: number;
    readonly orbitLength: number | undefined;
  }[];
}

const TRANSITION_BEFORE = "9999";
const TRANSITION_AFTER = "10001";
const NOVA_PRECISION_CENTER = [
  "-0.5635056508978129403584865883114601384960985093031720655813935",
  "0.4604381744326210260055039469581156001484013367015524702673916",
] as const;
const NOVA_PRECISION_MAGNIFICATION =
  "1.070058208140000140438545312564820364016081573715070873742049e+21";
const NEWTON_PERFORMANCE_CENTER = [
  "-0.0000013090732769674680201748306386469483646159030100203992577828080034943",
  "-0.001304671447909685389199223546332107722645616126425974515168737340059",
] as const;
const NEWTON_PERFORMANCE_MAGNIFICATION =
  "9.0811650073834342377820442066697583223684860293542614851784308324887e+27";
const MANDELBROT_SHORT_REFERENCE_CENTER = [
  "-1.4048601313310991290888893077228107618800577631943",
  "0.0010390882775924769855974541599294561763543808494182",
] as const;
const MANDELBROT_SHORT_REFERENCE_MAGNIFICATION =
  "444186.58960789106430842238211985499318890081104335";

const SCENARIOS: readonly DeepZoomScenario[] = [
  {
    id: "julia",
    label: "Множество Жюлиа",
    center: ["0.0052639026628578025", "-0.204026845637584"],
  },
  {
    id: "tricorn",
    label: "Трикорн",
    center: ["0.33886661134821283", "-0.8104026845637584"],
  },
  {
    id: "burning-ship",
    label: "Burning Ship",
    center: ["0.4154055639586334", "0.2644295302013423"],
  },
  {
    id: "phoenix",
    label: "Феникс",
    center: ["-0.4740386578445767", "-1.0630872483221476"],
  },
];

test("rendering keeps the controls responsive and coalesces stale ordinary frames", async ({
  page,
}) => {
  await installPerformanceProbe(page, 260);
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  await page.goto("/");
  const canvas = page.locator("#fractal-canvas");
  await expect(canvas).toBeVisible();
  await waitForCanvasFrame(page, canvas);
  await page.waitForTimeout(300);
  await resetPerformanceProbe(page);

  await page.getByLabel("Палитра").selectOption("1");
  await expect.poll(async () => (await readPerformanceProbe(page)).draws.length).toBeGreaterThan(0);

  const uiUpdates = await page.locator("#color-density").evaluate(async (element) => {
    const input = element as HTMLInputElement;
    const output = document.querySelector<HTMLOutputElement>('output[for="color-density"]');
    const values = ["0.080", "0.090", "0.105", "0.120", "0.135", "0.150"];
    const startedAt = window.performance.now();
    const renderedValues: string[] = [];

    for (const value of values) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await Promise.resolve();
      renderedValues.push(output?.textContent?.trim() ?? "");
      await new Promise((resolve) => window.setTimeout(resolve, 20));
    }

    return {
      elapsedMs: window.performance.now() - startedAt,
      renderedValues,
      values,
    };
  });

  expect(uiUpdates.renderedValues).toEqual(uiUpdates.values);
  expect(uiUpdates.elapsedMs, "control updates waited for the artificial GPU fence").toBeLessThan(
    250,
  );

  await expect
    .poll(async () => {
      const draws = (await readPerformanceProbe(page)).draws;
      return draws.at(-1)?.colorDensity;
    })
    .toBeCloseTo(0.15);
  await page.waitForTimeout(600);

  const performance = await readPerformanceProbe(page);
  expect(
    performance.draws.length,
    "stale ordinary frames accumulated in the GPU queue",
  ).toBeLessThan(4);
  expect(performance.draws.at(-1)?.colorDensity).toBeCloseTo(0.15);
  expect(performance.draws.slice(1).every((draw) => draw.colorDensity === 0.15)).toBe(true);

  const webgl = await probeWebGl(canvas);
  expect(webgl.contextLost).toBe(false);
  expect(webgl.error).toBe(0);
  await expect(page.locator(".render-error")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

for (const scenario of SCENARIOS) {
  test(`${scenario.label}: deep-zoom transition and pan stay stable in WebGL2`, async ({
    page,
  }, testInfo) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        runtimeErrors.push(message.text());
      }
    });

    await page.goto("/");
    const canvas = page.locator("#fractal-canvas");
    await expect(canvas).toBeVisible();
    await waitForCanvasFrame(page, canvas);

    await selectFormula(page, scenario.label);
    await setExactView(page, scenario.center, TRANSITION_BEFORE);
    await waitForCanvasFrame(page, canvas);
    const beforeTransition = await captureCanvas(page, canvas);
    expectUsefulFrame(beforeTransition);

    await setExactView(page, scenario.center, TRANSITION_AFTER);
    await waitForDeepZoom(page);
    await waitForCanvasFrame(page, canvas);
    const afterTransition = await captureCanvas(page, canvas, `${scenario.id}-deep.png`);
    expectUsefulFrame(afterTransition);

    const transitionMetrics = compareSamples(beforeTransition, afterTransition);
    expect(
      transitionMetrics.correlation,
      `${scenario.id}: structure changed while crossing the 10 000× boundary`,
    ).toBeGreaterThan(0.65);
    expect(
      transitionMetrics.centroidShift,
      `${scenario.id}: structure position jumped while enabling deep zoom`,
    ).toBeLessThan(0.08);

    const centerBeforePan = await readExactCenter(page);
    await page.keyboard.press("ArrowRight");
    await waitForDeepZoom(page);
    await waitForCanvasFrame(page, canvas);
    const centerAfterPan = await readExactCenter(page);
    const afterPan = await captureCanvas(page, canvas, `${scenario.id}-panned.png`);
    expectUsefulFrame(afterPan);

    expect(centerAfterPan).not.toEqual(centerBeforePan);
    expect(
      compareSamples(afterTransition, afterPan).meanAbsoluteError,
      `${scenario.id}: pan did not produce a visible change`,
    ).toBeGreaterThan(0.002);
    const webgl = await probeWebGl(canvas);
    expect(webgl.version).toContain("WebGL 2.0");
    expect(webgl.contextLost).toBe(false);
    expect(webgl.error).toBe(0);
    await expect(page.locator(".render-error")).toHaveCount(0);
    expect(runtimeErrors).toEqual([]);

    await attachMetrics(testInfo, {
      formula: scenario.id,
      transition: transitionMetrics,
      centerBeforePan,
      centerAfterPan,
      webgl,
    });
  });
}

test("Mandelbrot: a short reference orbit is accepted at higher iteration limits", async ({
  page,
}, testInfo) => {
  await installPerformanceProbe(page);
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  await page.goto("/");
  const canvas = page.locator("#fractal-canvas");
  await expect(canvas).toBeVisible();
  const iterations = page.locator("#iterations");
  await iterations.evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "200";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await setExactView(
    page,
    MANDELBROT_SHORT_REFERENCE_CENTER,
    MANDELBROT_SHORT_REFERENCE_MAGNIFICATION,
  );
  await waitForDeepZoom(page);
  expectUsefulFrame(await captureCanvas(page, canvas));

  await iterations.evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "500";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator(".deep-zoom-status")).toHaveAttribute("data-state", "preparing");
  await waitForDeepZoom(page);
  expectUsefulFrame(await captureCanvas(page, canvas));

  const performance = await readPerformanceProbe(page);
  expect(performance.referenceRequests).toBe(2);
  expect(performance.referenceResults).toHaveLength(2);
  expect(performance.referenceResults.every((result) => result.orbitLength === 158)).toBe(true);
  const webgl = await probeWebGl(canvas);
  expect(webgl.contextLost).toBe(false);
  expect(webgl.error).toBe(0);
  await expect(page.locator(".render-error")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);

  await attachMetrics(testInfo, {
    formula: "mandelbrot",
    magnification: MANDELBROT_SHORT_REFERENCE_MAGNIFICATION,
    performance,
    webgl,
  });
});

test("Nova: the deep perturbation frame stays precise near a late pole encounter", async ({
  page,
}, testInfo) => {
  await installPerformanceProbe(page);
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  await page.goto("/");
  const canvas = page.locator("#fractal-canvas");
  await expect(canvas).toBeVisible();
  await selectFormula(page, "Nova");
  await page.locator("#iterations").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "500";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await setExactView(page, NOVA_PRECISION_CENTER, NOVA_PRECISION_MAGNIFICATION);
  await waitForDeepZoom(page);
  const sample = await captureCanvas(page, canvas, "nova-precision-deep.png");
  expectUsefulFrame(sample);
  const preparation = await readPerformanceProbe(page);
  expect(preparation.referenceRequests).toBe(1);
  expect(preparation.referenceResults.at(-1)?.candidateCount).toBe(2);
  const fullFrames = await collectFullFrameSamples(page);

  await resetPerformanceProbe(page);
  await page.keyboard.press("=");
  await expect
    .poll(async () => {
      const probe = await readPerformanceProbe(page);
      return probe.draws.some((draw) => draw.width >= 900);
    })
    .toBe(true);
  await waitForPerformanceTimers(page);
  const zoomInteraction = await readPerformanceProbe(page);
  expect(zoomInteraction.referenceRequests, "pure zoom started a new reference worker").toBe(0);
  expect(zoomInteraction.draws.find((draw) => draw.width < 900)?.maxIterations).toBe(500);
  expect(
    zoomInteraction.draws.length,
    "pure zoom queued redundant deep-zoom frames",
  ).toBeLessThanOrEqual(2);

  const webgl = await probeWebGl(canvas);
  expect(webgl.version).toContain("WebGL 2.0");
  expect(webgl.contextLost).toBe(false);
  expect(webgl.error).toBe(0);
  await expect(page.locator(".render-error")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
  reportPerformance("Nova", preparation, fullFrames, zoomInteraction, webgl);

  await attachMetrics(testInfo, {
    formula: "nova",
    magnification: NOVA_PRECISION_MAGNIFICATION,
    preparation,
    fullFrames,
    sample: {
      centroid: sample.centroid,
      gradientWeight: sample.gradientWeight,
      uniqueColors: sample.uniqueColors,
      variance: sample.variance,
    },
    zoomInteraction,
    webgl,
  });
});

test("Newton: the extreme deep-zoom performance camera produces a useful frame", async ({
  page,
}, testInfo) => {
  await installPerformanceProbe(page);
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  await page.goto("/");
  const canvas = page.locator("#fractal-canvas");
  await expect(canvas).toBeVisible();
  await selectFormula(page, "Newton");
  await page.locator("#iterations").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "600";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await setExactView(page, NEWTON_PERFORMANCE_CENTER, NEWTON_PERFORMANCE_MAGNIFICATION);
  await waitForDeepZoom(page);
  const sample = await captureCanvas(page, canvas);
  expectUsefulFrame(sample);

  const performance = await readPerformanceProbe(page);
  expect(performance.referenceRequests).toBe(1);
  const fullFrames = await collectFullFrameSamples(page);

  await resetPerformanceProbe(page);
  await page.keyboard.press("=");
  await expect
    .poll(async () => {
      const probe = await readPerformanceProbe(page);
      return probe.draws.some((draw) => draw.width >= 900);
    })
    .toBe(true);
  await waitForPerformanceTimers(page);
  const zoomInteraction = await readPerformanceProbe(page);
  expect(zoomInteraction.referenceRequests, "pure zoom started a new reference worker").toBe(0);
  expect(zoomInteraction.draws.find((draw) => draw.width < 900)?.maxIterations).toBe(600);
  expect(
    zoomInteraction.draws.length,
    "pure zoom queued redundant deep-zoom frames",
  ).toBeLessThanOrEqual(2);

  const webgl = await probeWebGl(canvas);
  expect(webgl.version).toContain("WebGL 2.0");
  expect(webgl.contextLost).toBe(false);
  expect(webgl.error).toBe(0);
  await expect(page.locator(".render-error")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
  reportPerformance("Newton", performance, fullFrames, zoomInteraction, webgl);

  await attachMetrics(testInfo, {
    formula: "newton",
    magnification: NEWTON_PERFORMANCE_MAGNIFICATION,
    performance,
    fullFrames,
    zoomInteraction,
    sample: {
      centroid: sample.centroid,
      gradientWeight: sample.gradientWeight,
      uniqueColors: sample.uniqueColors,
      variance: sample.variance,
    },
    webgl,
  });
});

async function selectFormula(page: Page, label: string): Promise<void> {
  const shortcut = await page.evaluate(() =>
    /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "Meta+K" : "Control+K",
  );
  await page.keyboard.press(shortcut);
  const dialog = page.getByRole("dialog", { name: "Каталог фракталов" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox", { name: "Поиск формулы" }).fill(label);
  await dialog.locator(".formula-card").filter({ hasText: label }).click();
  await expect(dialog).toBeHidden();
}

async function setExactView(
  page: Page,
  center: readonly [real: string, imaginary: string],
  magnification: string,
): Promise<void> {
  await page.getByRole("button", { name: "Открыть точные координаты и масштаб" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Координаты и масштаб" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox", { name: "Действительная часть · Re" }).fill(center[0]);
  await dialog.getByRole("textbox", { name: "Мнимая часть · Im" }).fill(center[1]);
  await dialog.getByRole("textbox", { name: "Увеличение · Zoom" }).fill(magnification);
  await dialog.getByRole("button", { name: "Перейти к виду" }).click();
  await expect(dialog).toBeHidden();
}

async function readExactCenter(page: Page): Promise<readonly [string, string]> {
  await page.getByRole("button", { name: "Открыть точные координаты и масштаб" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Координаты и масштаб" });
  await expect(dialog).toBeVisible();
  const center = [
    await dialog.getByRole("textbox", { name: "Действительная часть · Re" }).inputValue(),
    await dialog.getByRole("textbox", { name: "Мнимая часть · Im" }).inputValue(),
  ] as const;
  await dialog.getByRole("button", { name: "Отмена" }).click();
  await expect(dialog).toBeHidden();
  return center;
}

async function waitForDeepZoom(page: Page): Promise<void> {
  const status = page.locator(".deep-zoom-status");
  await expect(status).toHaveAttribute("data-state", "ready", { timeout: 45_000 });
  await expect(status).not.toContainText("недоступен");
}

async function waitForCanvasFrame(page: Page, canvas: Locator): Promise<void> {
  await expect
    .poll(() =>
      canvas.evaluate((element) => {
        const target = element as HTMLCanvasElement;
        return target.width > 1 && target.height > 1;
      }),
    )
    .toBe(true);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

async function captureCanvas(
  page: Page,
  canvas: Locator,
  snapshotName?: string,
): Promise<CanvasSample> {
  const hiddenUi = await page.addStyleTag({
    content: `
      .controls-host,
      .coordinates,
      .deep-zoom-status,
      .topbar {
        visibility: hidden !important;
      }
    `,
  });

  try {
    await waitForCanvasFrame(page, canvas);
    const sample = await sampleCanvas(canvas);
    if (snapshotName) {
      await expect(canvas).toHaveScreenshot(snapshotName);
    }
    return sample;
  } finally {
    await hiddenUi.evaluate((element) => element.parentNode?.removeChild(element));
  }
}

async function sampleCanvas(canvas: Locator): Promise<CanvasSample> {
  const screenshot = await canvas.screenshot();
  const dataUrl = `data:image/png;base64,${screenshot.toString("base64")}`;

  return canvas.evaluate(async (_element, screenshotUrl) => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const candidate = new Image();
      candidate.addEventListener("load", () => resolve(candidate), { once: true });
      candidate.addEventListener("error", () => reject(new Error("Canvas screenshot is invalid")), {
        once: true,
      });
      candidate.src = screenshotUrl;
    });
    const width = 96;
    const height = 64;
    const copy = document.createElement("canvas");
    copy.width = width;
    copy.height = height;
    const context = copy.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("2D context is unavailable for the canvas probe");
    }
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;
    const luminance: number[] = [];
    const colors = new Set<number>();
    let sum = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index]! / 255;
      const green = pixels[index + 1]! / 255;
      const blue = pixels[index + 2]! / 255;
      const value = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      luminance.push(value);
      sum += value;
      colors.add(
        (Math.round(red * 15) << 8) | (Math.round(green * 15) << 4) | Math.round(blue * 15),
      );
    }

    const mean = sum / luminance.length;
    const variance =
      luminance.reduce((total, value) => total + (value - mean) ** 2, 0) / luminance.length;
    let gradientWeight = 0;
    let weightedX = 0;
    let weightedY = 0;

    for (let y = 1; y < height; y += 1) {
      for (let x = 1; x < width; x += 1) {
        const index = y * width + x;
        const weight =
          Math.abs(luminance[index]! - luminance[index - 1]!) +
          Math.abs(luminance[index]! - luminance[index - width]!);
        gradientWeight += weight;
        weightedX += weight * (x / (width - 1));
        weightedY += weight * (y / (height - 1));
      }
    }

    return {
      centroid:
        gradientWeight > 0
          ? ([weightedX / gradientWeight, weightedY / gradientWeight] as const)
          : ([0.5, 0.5] as const),
      gradientWeight,
      luminance,
      uniqueColors: colors.size,
      variance,
    };
  }, dataUrl);
}

function expectUsefulFrame(sample: CanvasSample): void {
  expect(sample.uniqueColors, "canvas is effectively a flat color").toBeGreaterThan(12);
  expect(sample.variance, "canvas has insufficient luminance detail").toBeGreaterThan(0.0005);
  expect(sample.gradientWeight, "canvas has no measurable structure").toBeGreaterThan(1);
}

function compareSamples(
  left: CanvasSample,
  right: CanvasSample,
): {
  readonly centroidShift: number;
  readonly correlation: number;
  readonly meanAbsoluteError: number;
} {
  const leftMean = average(left.luminance);
  const rightMean = average(right.luminance);
  let covariance = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  let absoluteError = 0;

  for (let index = 0; index < left.luminance.length; index += 1) {
    const leftDelta = left.luminance[index]! - leftMean;
    const rightDelta = right.luminance[index]! - rightMean;
    covariance += leftDelta * rightDelta;
    leftVariance += leftDelta ** 2;
    rightVariance += rightDelta ** 2;
    absoluteError += Math.abs(left.luminance[index]! - right.luminance[index]!);
  }

  return {
    centroidShift: Math.hypot(
      left.centroid[0] - right.centroid[0],
      left.centroid[1] - right.centroid[1],
    ),
    correlation: covariance / Math.sqrt(leftVariance * rightVariance),
    meanAbsoluteError: absoluteError / left.luminance.length,
  };
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

async function probeWebGl(canvas: Locator): Promise<WebGlProbe> {
  return canvas.evaluate((element) => {
    const context = (element as HTMLCanvasElement).getContext("webgl2");
    if (!context) {
      throw new Error("WebGL2 context is unavailable");
    }
    const rendererInfo = context.getExtension("WEBGL_debug_renderer_info");
    return {
      contextLost: context.isContextLost(),
      error: context.getError(),
      renderer: rendererInfo
        ? String(context.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL))
        : String(context.getParameter(context.RENDERER)),
      version: String(context.getParameter(context.VERSION)),
    };
  });
}

async function installPerformanceProbe(page: Page, artificialFenceDelayMs = 0): Promise<void> {
  await page.addInitScript((fenceDelayMs) => {
    interface TimerQueryExtension {
      readonly GPU_DISJOINT_EXT: number;
      readonly TIME_ELAPSED_EXT: number;
    }

    const metrics = {
      draws: [] as {
        at: number;
        disjoint?: boolean;
        gpuMs?: number;
        height: number;
        colorDensity?: number;
        maxIterations?: number;
        timerAvailable: boolean;
        width: number;
      }[],
      referenceRequests: 0,
      referenceResults: [] as {
        candidateCount: number | undefined;
        durationMs: number;
        orbitLength: number | undefined;
      }[],
    };
    Reflect.set(window, "__deepZoomPerformanceProbe", metrics);

    const NativeWorker = window.Worker;
    const referenceWorkers = new WeakSet<Worker>();
    const requestStartedAt = new WeakMap<Worker, number>();
    window.Worker = class MeasuredWorker extends NativeWorker {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        super(scriptURL, options);
        if (String(scriptURL).includes("reference-orbit.worker")) {
          referenceWorkers.add(this);
          this.addEventListener("message", (event: MessageEvent<unknown>) => {
            const data = event.data;
            if (
              typeof data !== "object" ||
              data === null ||
              !("type" in data) ||
              data.type !== "result"
            ) {
              return;
            }

            const startedAt = requestStartedAt.get(this);
            const result =
              "result" in data && typeof data.result === "object" && data.result !== null
                ? data.result
                : undefined;
            metrics.referenceResults.push({
              candidateCount:
                result && "candidateCount" in result && typeof result.candidateCount === "number"
                  ? result.candidateCount
                  : undefined,
              durationMs: startedAt === undefined ? 0 : performance.now() - startedAt,
              orbitLength:
                result && "orbitLength" in result && typeof result.orbitLength === "number"
                  ? result.orbitLength
                  : undefined,
            });
          });
        }
      }

      override postMessage(
        message: unknown,
        transferOrOptions?: StructuredSerializeOptions | Transferable[],
      ): void {
        if (referenceWorkers.has(this)) {
          metrics.referenceRequests += 1;
          requestStartedAt.set(this, performance.now());
        }
        if (transferOrOptions === undefined) {
          super.postMessage(message);
        } else if (Array.isArray(transferOrOptions)) {
          super.postMessage(message, transferOrOptions as Transferable[]);
        } else {
          super.postMessage(message, transferOrOptions);
        }
      }
    };

    const nativeDrawArrays = Reflect.get(
      WebGL2RenderingContext.prototype,
      "drawArrays",
    ) as WebGL2RenderingContext["drawArrays"];
    const nativeGetUniformLocation = Reflect.get(
      WebGL2RenderingContext.prototype,
      "getUniformLocation",
    ) as WebGL2RenderingContext["getUniformLocation"];
    const nativeUniform1i = Reflect.get(
      WebGL2RenderingContext.prototype,
      "uniform1i",
    ) as WebGL2RenderingContext["uniform1i"];
    const nativeUniform1f = Reflect.get(
      WebGL2RenderingContext.prototype,
      "uniform1f",
    ) as WebGL2RenderingContext["uniform1f"];
    const nativeFenceSync = Reflect.get(
      WebGL2RenderingContext.prototype,
      "fenceSync",
    ) as WebGL2RenderingContext["fenceSync"];
    const nativeClientWaitSync = Reflect.get(
      WebGL2RenderingContext.prototype,
      "clientWaitSync",
    ) as WebGL2RenderingContext["clientWaitSync"];
    const uniformNames = new WeakMap<WebGLUniformLocation, string>();
    const maximumIterations = new WeakMap<WebGL2RenderingContext, number>();
    const colorDensities = new WeakMap<WebGL2RenderingContext, number>();
    const artificialSyncAvailability = new WeakMap<WebGLSync, number>();
    WebGL2RenderingContext.prototype.getUniformLocation = function measuredGetUniformLocation(
      program: WebGLProgram,
      name: string,
    ): WebGLUniformLocation | null {
      const location = Reflect.apply(nativeGetUniformLocation, this, [program, name]);
      if (location) {
        uniformNames.set(location, name);
      }
      return location;
    };
    WebGL2RenderingContext.prototype.uniform1i = function measuredUniform1i(
      location: WebGLUniformLocation | null,
      value: GLint,
    ): void {
      if (location && uniformNames.get(location) === "u_maxIterations") {
        maximumIterations.set(this, value);
      }
      Reflect.apply(nativeUniform1i, this, [location, value]);
    };
    WebGL2RenderingContext.prototype.uniform1f = function measuredUniform1f(
      location: WebGLUniformLocation | null,
      value: GLfloat,
    ): void {
      if (location && uniformNames.get(location) === "u_colorDensity") {
        colorDensities.set(this, value);
      }
      Reflect.apply(nativeUniform1f, this, [location, value]);
    };
    WebGL2RenderingContext.prototype.fenceSync = function measuredFenceSync(
      condition: GLenum,
      flags: GLbitfield,
    ): WebGLSync | null {
      const sync = Reflect.apply(nativeFenceSync, this, [condition, flags]);
      if (sync && fenceDelayMs > 0 && (this.canvas as HTMLCanvasElement).id === "fractal-canvas") {
        artificialSyncAvailability.set(sync, performance.now() + fenceDelayMs);
      }
      return sync;
    };
    WebGL2RenderingContext.prototype.clientWaitSync = function measuredClientWaitSync(
      sync: WebGLSync,
      flags: GLbitfield,
      timeout: GLuint64,
    ): GLenum {
      const availableAt = artificialSyncAvailability.get(sync);
      if (availableAt !== undefined && performance.now() < availableAt) {
        return this.TIMEOUT_EXPIRED;
      }
      return Reflect.apply(nativeClientWaitSync, this, [sync, flags, timeout]);
    };
    const timerExtensions = new WeakMap<WebGL2RenderingContext, TimerQueryExtension | null>();
    WebGL2RenderingContext.prototype.drawArrays = function measuredDrawArrays(
      mode: GLenum,
      first: GLint,
      count: GLsizei,
    ): void {
      let extension = timerExtensions.get(this);
      if (extension === undefined) {
        extension = this.getExtension(
          "EXT_disjoint_timer_query_webgl2",
        ) as TimerQueryExtension | null;
        timerExtensions.set(this, extension);
      }
      const query = extension ? this.createQuery() : null;
      const draw = {
        at: performance.now(),
        colorDensity: colorDensities.get(this),
        height: this.drawingBufferHeight,
        maxIterations: maximumIterations.get(this),
        timerAvailable: extension !== null && query !== null,
        width: this.drawingBufferWidth,
      } as {
        at: number;
        disjoint?: boolean;
        gpuMs?: number;
        height: number;
        colorDensity?: number;
        maxIterations?: number;
        timerAvailable: boolean;
        width: number;
      };
      if ((this.canvas as HTMLCanvasElement).id === "fractal-canvas") {
        metrics.draws.push(draw);
      }

      if (extension && query) {
        this.beginQuery(extension.TIME_ELAPSED_EXT, query);
      }
      try {
        Reflect.apply(nativeDrawArrays, this, [mode, first, count]);
      } finally {
        if (extension && query) {
          this.endQuery(extension.TIME_ELAPSED_EXT);
          pollTimerQuery(this, extension, query, draw);
        }
      }
    };

    function pollTimerQuery(
      gl: WebGL2RenderingContext,
      extension: TimerQueryExtension,
      query: WebGLQuery,
      draw: {
        disjoint?: boolean;
        gpuMs?: number;
      },
    ): void {
      if (gl.isContextLost()) {
        draw.disjoint = true;
        return;
      }
      if (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
        window.setTimeout(() => pollTimerQuery(gl, extension, query, draw), 8);
        return;
      }

      draw.disjoint = Boolean(gl.getParameter(extension.GPU_DISJOINT_EXT));
      if (!draw.disjoint) {
        draw.gpuMs = Number(gl.getQueryParameter(query, gl.QUERY_RESULT)) / 1_000_000;
      }
      gl.deleteQuery(query);
    }
  }, artificialFenceDelayMs);
}

async function readPerformanceProbe(page: Page): Promise<DeepZoomPerformanceProbe> {
  return page.evaluate(() => {
    const probe = Reflect.get(window, "__deepZoomPerformanceProbe") as DeepZoomPerformanceProbe;
    return {
      draws: probe.draws.map((draw) => ({ ...draw })),
      referenceRequests: probe.referenceRequests,
      referenceResults: probe.referenceResults.map((result) => ({ ...result })),
    };
  });
}

async function resetPerformanceProbe(page: Page): Promise<void> {
  await page.evaluate(() => {
    const probe = Reflect.get(window, "__deepZoomPerformanceProbe") as {
      draws: unknown[];
      referenceRequests: number;
      referenceResults: unknown[];
    };
    probe.draws.length = 0;
    probe.referenceRequests = 0;
    probe.referenceResults.length = 0;
  });
}

async function waitForPerformanceTimers(page: Page): Promise<void> {
  await expect
    .poll(async () => {
      const probe = await readPerformanceProbe(page);
      return probe.draws.every(
        (draw) => !draw.timerAvailable || draw.gpuMs !== undefined || draw.disjoint !== undefined,
      );
    })
    .toBe(true);
}

async function collectFullFrameSamples(page: Page): Promise<DeepZoomPerformanceProbe> {
  await resetPerformanceProbe(page);
  const palette = page.getByLabel("Палитра");
  for (const value of ["1", "2", "3", "0", "1"]) {
    const previousDrawCount = (await readPerformanceProbe(page)).draws.length;
    await palette.selectOption(value);
    await expect
      .poll(async () => {
        const draws = (await readPerformanceProbe(page)).draws.slice(previousDrawCount);
        return draws.some((draw) => draw.width >= 900);
      })
      .toBe(true);
    await waitForPerformanceTimers(page);
  }
  return readPerformanceProbe(page);
}

function reportPerformance(
  formula: string,
  preparation: DeepZoomPerformanceProbe,
  fullFrames: DeepZoomPerformanceProbe,
  interaction: DeepZoomPerformanceProbe | undefined,
  webgl: WebGlProbe,
): void {
  const fullFrameDraws = fullFrames.draws.filter((draw) => draw.width >= 900);
  const fullGpuSamples = fullFrameDraws
    .map((draw) => draw.gpuMs)
    .filter((value): value is number => value !== undefined)
    .sort((left, right) => left - right);
  const previewGpuSamples = (interaction?.draws ?? [])
    .filter((draw) => draw.width < 900)
    .map((draw) => draw.gpuMs)
    .filter((value): value is number => value !== undefined);

  console.log(
    `[deep-zoom-performance] ${JSON.stringify({
      formula,
      renderer: webgl.renderer,
      reference: preparation.referenceResults.at(-1),
      full: {
        drawingBuffers: fullFrameDraws.map((draw) => [draw.width, draw.height]),
        drawCount: fullFrameDraws.length,
        gpuDisjoint: fullFrameDraws.some((draw) => draw.disjoint),
        iterations: fullFrameDraws.map((draw) => draw.maxIterations),
        medianGpuMs:
          fullGpuSamples.length === 0
            ? undefined
            : fullGpuSamples[Math.floor(fullGpuSamples.length / 2)],
        samplesGpuMs: fullGpuSamples,
      },
      interaction: interaction
        ? {
            drawingBuffers: interaction.draws.map((draw) => [draw.width, draw.height]),
            drawCount: interaction.draws.length,
            gpuDisjoint: interaction.draws.some((draw) => draw.disjoint),
            iterations: interaction.draws.map((draw) => draw.maxIterations),
            previewGpuMs: previewGpuSamples,
            referenceRequests: interaction.referenceRequests,
          }
        : undefined,
    })}`,
  );
}

async function attachMetrics(testInfo: TestInfo, value: unknown): Promise<void> {
  await testInfo.attach("deep-zoom-metrics", {
    body: `${JSON.stringify(value, null, 2)}\n`,
    contentType: "application/json",
  });
}
