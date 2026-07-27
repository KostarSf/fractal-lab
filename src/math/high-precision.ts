import Decimal from "decimal.js";
import type { ComplexValue } from "../fractals/types.ts";

export type DecimalString = string;

export interface SerializedCamera {
  readonly center: readonly [DecimalString, DecimalString];
  readonly scale: DecimalString;
}

export const DEEP_ZOOM_MAGNIFICATION = 10_000;
// The perturbation delta is carried by a WebGL highp float. Keeping a few
// orders of magnitude above its normal minimum preserves sub-pixel offsets.
export const MIN_CAMERA_SCALE = "1e-35";
const MAX_CAMERA_SCALE = "8";
const GUARD_DIGITS = 40;
const MAX_PRECISION_DIGITS = 340;

export function shouldUseDeepZoom(magnification: number): boolean {
  return Number.isFinite(magnification) && magnification >= DEEP_ZOOM_MAGNIFICATION;
}

export function precisionForScale(scale: DecimalString): number {
  const exponent = new Decimal(scale).e;
  return Math.min(MAX_PRECISION_DIGITS, Math.max(50, Math.max(0, -exponent) + GUARD_DIGITS));
}

function decimalContext(scale: DecimalString): typeof Decimal {
  return Decimal.clone({
    precision: precisionForScale(scale),
    rounding: Decimal.ROUND_HALF_EVEN,
    toExpNeg: -1_000,
    toExpPos: 1_000,
  });
}

function serialize(value: Decimal, precision: number): DecimalString {
  return value.toSignificantDigits(precision).toString();
}

export function createSerializedCamera(center: ComplexValue, scale: number): SerializedCamera {
  const safeScale =
    Number.isFinite(scale) && scale > 0
      ? Math.max(Number(MIN_CAMERA_SCALE), Math.min(Number(MAX_CAMERA_SCALE), scale))
      : Number(MIN_CAMERA_SCALE);
  return {
    center: [String(center[0]), String(center[1])],
    scale: String(safeScale),
  };
}

export function createCameraFromMagnification(
  center: readonly [DecimalString, DecimalString],
  magnification: DecimalString,
  initialScale: number,
): SerializedCamera {
  const D = Decimal.clone({
    precision: MAX_PRECISION_DIGITS,
    rounding: Decimal.ROUND_HALF_EVEN,
    toExpNeg: -1_000,
    toExpPos: 1_000,
  });
  const real = new D(center[0]);
  const imaginary = new D(center[1]);
  const zoom = new D(magnification);

  if (
    !real.isFinite() ||
    !imaginary.isFinite() ||
    !Number.isFinite(real.toNumber()) ||
    !Number.isFinite(imaginary.toNumber())
  ) {
    throw new Error("Координаты должны быть конечными числами.");
  }
  if (!zoom.isFinite() || zoom.lte(0)) {
    throw new Error("Масштаб должен быть положительным конечным числом.");
  }

  return {
    center: [real.toString(), imaginary.toString()],
    scale: new D(initialScale.toString()).dividedBy(zoom).toString(),
  };
}

export function parseCoordinateLine(
  coordinateLine: string,
): readonly [real: DecimalString, imaginary: DecimalString, magnification: DecimalString] {
  const values = coordinateLine.split(",").map((value) => value.trim());

  if (values.length !== 3 || values.some((value) => value.length === 0)) {
    throw new Error(
      "Строка должна содержать действительную часть, мнимую часть и увеличение через запятую.",
    );
  }

  return [values[0]!, values[1]!, values[2]!];
}

export function magnificationForScale(initialScale: number, scale: DecimalString): DecimalString {
  const D = decimalContext(scale);
  const magnification = new D(initialScale.toString()).dividedBy(scale);
  return Math.abs(magnification.e) >= 12 ? magnification.toExponential() : magnification.toString();
}

export function clampCameraScale(
  camera: SerializedCamera,
  minimumScale: DecimalString = MIN_CAMERA_SCALE,
): SerializedCamera {
  const D = decimalContext(camera.scale);
  const precision = precisionForScale(camera.scale);
  const safeMinimum = D.min(MAX_CAMERA_SCALE, D.max(MIN_CAMERA_SCALE, new D(minimumScale)));
  const scale = D.max(safeMinimum, D.min(MAX_CAMERA_SCALE, new D(camera.scale)));

  return {
    center: camera.center,
    scale: serialize(scale, precision),
  };
}

export function approximateCamera(camera: SerializedCamera): {
  readonly center: [number, number];
  readonly scale: number;
} {
  return {
    center: [Number(camera.center[0]), Number(camera.center[1])],
    scale: Number(camera.scale),
  };
}

export function translateCamera(
  camera: SerializedCamera,
  normalizedOffset: ComplexValue,
): SerializedCamera {
  const D = decimalContext(camera.scale);
  const precision = precisionForScale(camera.scale);
  const scale = new D(camera.scale);

  return {
    center: [
      serialize(
        new D(camera.center[0]).plus(scale.times(normalizedOffset[0].toString())),
        precision,
      ),
      serialize(
        new D(camera.center[1]).plus(scale.times(normalizedOffset[1].toString())),
        precision,
      ),
    ],
    scale: camera.scale,
  };
}

/**
 * Keeps the point at `previousNormalized` under `nextNormalized` while
 * applying a scale factor. This covers cursor zoom and two-finger gestures.
 */
export function transformCamera(
  camera: SerializedCamera,
  previousNormalized: ComplexValue,
  nextNormalized: ComplexValue,
  scaleFactor: number,
  minimumScale: DecimalString = MIN_CAMERA_SCALE,
): SerializedCamera {
  if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) {
    return camera;
  }

  const D = decimalContext(camera.scale);
  const precision = precisionForScale(camera.scale);
  const currentScale = new D(camera.scale);
  const safeMinimum = D.min(MAX_CAMERA_SCALE, D.max(MIN_CAMERA_SCALE, new D(minimumScale)));
  let nextScale = currentScale.times(scaleFactor.toString());
  nextScale = D.max(safeMinimum, D.min(MAX_CAMERA_SCALE, nextScale));

  const nextCenter = ([0, 1] as const).map((component) => {
    const anchor = new D(camera.center[component]).plus(
      currentScale.times(previousNormalized[component].toString()),
    );
    return serialize(
      anchor.minus(nextScale.times(nextNormalized[component].toString())),
      precision,
    );
  }) as [DecimalString, DecimalString];

  return {
    center: nextCenter,
    scale: serialize(nextScale, precision),
  };
}

export function decimalDifferenceToNumber(
  left: DecimalString,
  right: DecimalString,
  scale: DecimalString,
): number {
  const D = decimalContext(scale);
  return new D(left).minus(right).toNumber();
}

export function formatDecimalCoordinate(value: DecimalString, scale: DecimalString): string {
  const depth = Math.max(0, -new Decimal(scale).e);
  const decimalPlaces = Math.max(6, Math.min(36, depth + 3));
  return new Decimal(value).toFixed(decimalPlaces).replace("-", "−");
}
