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

const TRANSITION_BEFORE = "9999";
const TRANSITION_AFTER = "10001";

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

async function attachMetrics(testInfo: TestInfo, value: unknown): Promise<void> {
  await testInfo.attach("deep-zoom-metrics", {
    body: `${JSON.stringify(value, null, 2)}\n`,
    contentType: "application/json",
  });
}
