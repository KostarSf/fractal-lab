import type { AffineTransform, GeometricIfsFormula, GeometricColoring } from "../fractals/types.ts";

const SQUARE_SIZE = [2, 2] as const;
const TRIANGLE_VIEW_CENTER_Y = Math.sqrt(3) / 6;
const TRIANGLE_VERTICES = [
  [-1, -Math.sqrt(3) / 3],
  [1, -Math.sqrt(3) / 3],
  [0, (2 * Math.sqrt(3)) / 3],
] as const;

function createGridTransforms(
  columns: number,
  rows: number,
  mask: readonly boolean[],
): readonly AffineTransform[] {
  const transforms: AffineTransform[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!mask[row * columns + column]) {
        continue;
      }
      transforms.push({
        matrix: [1 / columns, 0, 0, 1 / rows],
        translate: [column / columns, row / rows],
      });
    }
  }
  return transforms;
}

function createGridFormula(options: {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly mask: readonly boolean[];
  readonly coloring: GeometricColoring;
  readonly palette: number;
}): GeometricIfsFormula {
  const columns = 3;
  const rows = 3;
  return {
    id: options.id,
    label: options.label,
    description: options.description,
    renderer: "geometric-ifs",
    initialView: { center: [0, 0], scale: 2.35 },
    preview: {
      view: { center: [0, 0], scale: 2.35 },
      recursionDepth: 7,
      geometricColoring: options.coloring,
      palette: options.palette,
    },
    parameters: [],
    geometricIfs: {
      backend: "grid",
      baseArea: { shape: "rectangle", size: SQUARE_SIZE },
      grid: {
        columns,
        rows,
        mask: options.mask,
      },
      transforms: createGridTransforms(columns, rows, options.mask),
      contractionRatio: 1 / 3,
      recommendedMaxDepth: 15,
      defaultDepth: 7,
      defaultColoring: options.coloring,
    },
  };
}

const CARPET_MASK = [true, true, true, true, false, true, true, true, true] as const;

const VICSEK_CORNERS_MASK = [true, false, true, false, true, false, true, false, true] as const;

const VICSEK_CROSS_MASK = [false, true, false, true, true, true, false, true, false] as const;

const TRIANGLE_TRANSFORMS: readonly AffineTransform[] = TRIANGLE_VERTICES.map((vertex) => ({
  matrix: [0.5, 0, 0, 0.5],
  translate: [vertex[0] * 0.5, vertex[1] * 0.5],
}));

export const GEOMETRIC_IFS_FORMULAS: readonly GeometricIfsFormula[] = [
  {
    id: "sierpinski-triangle",
    label: "Треугольник Серпинского",
    description: "Три угловые копии равностороннего треугольника на каждом уровне.",
    renderer: "geometric-ifs",
    initialView: { center: [0, TRIANGLE_VIEW_CENTER_Y], scale: 2.1 },
    preview: {
      view: { center: [0, TRIANGLE_VIEW_CENTER_Y], scale: 2.1 },
      recursionDepth: 10,
      geometricColoring: "gradient",
      palette: 0,
    },
    parameters: [],
    geometricIfs: {
      backend: "triangle-corners",
      baseArea: { shape: "triangle", vertices: TRIANGLE_VERTICES },
      transforms: TRIANGLE_TRANSFORMS,
      contractionRatio: 0.5,
      recommendedMaxDepth: 22,
      defaultDepth: 10,
      defaultColoring: "gradient",
    },
  },
  createGridFormula({
    id: "sierpinski-carpet",
    label: "Ковёр Серпинского",
    description: "Квадратная сетка 3×3 без центральной ячейки на каждом уровне.",
    mask: CARPET_MASK,
    coloring: "level",
    palette: 1,
  }),
  createGridFormula({
    id: "vicsek-corners",
    label: "Vicsek · углы",
    description: "Центральная и четыре угловые ячейки сетки 3×3.",
    mask: VICSEK_CORNERS_MASK,
    coloring: "gradient",
    palette: 2,
  }),
  createGridFormula({
    id: "vicsek-cross",
    label: "Vicsek · крест",
    description: "Центральная и четыре осевые ячейки сетки 3×3.",
    mask: VICSEK_CROSS_MASK,
    coloring: "level",
    palette: 3,
  }),
];
