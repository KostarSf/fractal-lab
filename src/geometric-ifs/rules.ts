import type { ComplexValue, GeometricIfsRule } from "../fractals/types.ts";

export const MAX_GEOMETRIC_SHADER_DEPTH = 32;
export const MAX_GRID_CELLS = 16;

export interface GeometricPointClassification {
  readonly insideBaseArea: boolean;
  readonly retained: boolean;
  readonly removedAtLevel?: number;
  readonly address: number;
}

export function validateGeometricIfsRule(rule: GeometricIfsRule): void {
  if (
    !Number.isFinite(rule.contractionRatio) ||
    rule.contractionRatio <= 0 ||
    rule.contractionRatio >= 1
  ) {
    throw new Error("Коэффициент сокращения IFS должен быть между 0 и 1.");
  }
  if (
    !Number.isInteger(rule.recommendedMaxDepth) ||
    rule.recommendedMaxDepth < 1 ||
    rule.recommendedMaxDepth > MAX_GEOMETRIC_SHADER_DEPTH
  ) {
    throw new Error(`Глубина IFS должна быть от 1 до ${MAX_GEOMETRIC_SHADER_DEPTH}.`);
  }
  if (
    !Number.isInteger(rule.defaultDepth) ||
    rule.defaultDepth < 1 ||
    rule.defaultDepth > rule.recommendedMaxDepth
  ) {
    throw new Error("Начальная глубина IFS выходит за рекомендуемый предел.");
  }
  if (
    rule.transforms.length === 0 ||
    rule.transforms.some((transform) => !isFiniteTransform(transform))
  ) {
    throw new Error("IFS должен содержать конечные аффинные преобразования.");
  }

  if (rule.backend === "grid") {
    const { columns, rows, mask } = rule.grid;
    const cellCount = columns * rows;
    if (
      !Number.isInteger(columns) ||
      !Number.isInteger(rows) ||
      columns < 2 ||
      rows < 2 ||
      cellCount > MAX_GRID_CELLS ||
      mask.length !== cellCount
    ) {
      throw new Error(`Grid IFS поддерживает от 2 до ${MAX_GRID_CELLS} ячеек.`);
    }
    if (mask.filter(Boolean).length !== rule.transforms.length) {
      throw new Error("Число grid-преобразований не совпадает с маской IFS.");
    }
    if (
      rule.baseArea.size.length !== 2 ||
      rule.baseArea.size.some((size) => !Number.isFinite(size) || size <= 0)
    ) {
      throw new Error("Базовый прямоугольник IFS должен иметь положительный размер.");
    }
    return;
  }

  if (Math.abs(triangleDoubleArea(rule.baseArea.vertices)) < Number.EPSILON) {
    throw new Error("Базовый треугольник IFS не должен быть вырожденным.");
  }
}

export function resolveAutoRecursionDepth(
  scale: number,
  viewportHeight: number,
  rule: GeometricIfsRule,
): number {
  const safeScale = Math.max(Number.MIN_VALUE, Math.abs(scale));
  const safeHeight = Math.max(1, viewportHeight);
  const baseExtent =
    rule.backend === "grid"
      ? Math.max(rule.baseArea.size[0], rule.baseArea.size[1])
      : triangleMaxExtent(rule.baseArea.vertices);
  const basePixels = (baseExtent * safeHeight) / safeScale;
  const distinguishablePixels = 1.35;
  const rawDepth = Math.ceil(
    Math.log(Math.max(1, basePixels / distinguishablePixels)) / -Math.log(rule.contractionRatio),
  );
  return Math.max(1, Math.min(rule.recommendedMaxDepth, rawDepth));
}

export function classifyGeometricPoint(
  rule: GeometricIfsRule,
  point: ComplexValue,
  depth: number,
): GeometricPointClassification {
  const safeDepth = Math.max(0, Math.min(rule.recommendedMaxDepth, Math.trunc(depth)));
  return rule.backend === "grid"
    ? classifyGridPoint(rule, point, safeDepth)
    : classifyTrianglePoint(rule, point, safeDepth);
}

function classifyGridPoint(
  rule: Extract<GeometricIfsRule, { backend: "grid" }>,
  point: ComplexValue,
  depth: number,
): GeometricPointClassification {
  const [width, height] = rule.baseArea.size;
  let x = point[0] / width + 0.5;
  let y = point[1] / height + 0.5;
  if (x < 0 || x > 1 || y < 0 || y > 1) {
    return { insideBaseArea: false, retained: false, address: 0 };
  }

  let address = 0;
  for (let level = 1; level <= depth; level += 1) {
    const scaledX = x * rule.grid.columns;
    const scaledY = y * rule.grid.rows;
    const column = Math.min(rule.grid.columns - 1, Math.floor(scaledX));
    const row = Math.min(rule.grid.rows - 1, Math.floor(scaledY));
    const cell = row * rule.grid.columns + column;
    if (!rule.grid.mask[cell]) {
      return {
        insideBaseArea: true,
        retained: false,
        removedAtLevel: level,
        address,
      };
    }
    address = (address * 17 + cell + 1) % 4093;
    x = scaledX - column;
    y = scaledY - row;
  }
  return { insideBaseArea: true, retained: true, address };
}

function classifyTrianglePoint(
  rule: Extract<GeometricIfsRule, { backend: "triangle-corners" }>,
  point: ComplexValue,
  depth: number,
): GeometricPointClassification {
  const weights = barycentricCoordinates(rule.baseArea.vertices, point);
  if (weights.some((weight) => weight < 0 || weight > 1)) {
    return { insideBaseArea: false, retained: false, address: 0 };
  }

  let address = 0;
  for (let level = 1; level <= depth; level += 1) {
    const corner = weights.findIndex((weight) => weight >= 0.5);
    if (corner < 0) {
      return {
        insideBaseArea: true,
        retained: false,
        removedAtLevel: level,
        address,
      };
    }
    address = (address * 5 + corner + 1) % 4093;
    for (let index = 0; index < 3; index += 1) {
      weights[index] = weights[index]! * 2 - (index === corner ? 1 : 0);
    }
  }
  return { insideBaseArea: true, retained: true, address };
}

function barycentricCoordinates(
  vertices: readonly [ComplexValue, ComplexValue, ComplexValue],
  point: ComplexValue,
): [number, number, number] {
  const [a, b, c] = vertices;
  const denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
  const first =
    ((b[1] - c[1]) * (point[0] - c[0]) + (c[0] - b[0]) * (point[1] - c[1])) / denominator;
  const second =
    ((c[1] - a[1]) * (point[0] - c[0]) + (a[0] - c[0]) * (point[1] - c[1])) / denominator;
  return [first, second, 1 - first - second];
}

function triangleDoubleArea(vertices: readonly [ComplexValue, ComplexValue, ComplexValue]): number {
  const [a, b, c] = vertices;
  return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
}

function triangleMaxExtent(vertices: readonly [ComplexValue, ComplexValue, ComplexValue]): number {
  const x = vertices.map((vertex) => vertex[0]);
  const y = vertices.map((vertex) => vertex[1]);
  return Math.max(Math.max(...x) - Math.min(...x), Math.max(...y) - Math.min(...y));
}

function isFiniteTransform(transform: GeometricIfsRule["transforms"][number]): boolean {
  return [...transform.matrix, ...transform.translate].every(Number.isFinite);
}
