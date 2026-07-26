import type { FractalFormula, FractalParameterValue } from "./types.ts";

export const FRACTAL_FORMULAS: readonly FractalFormula[] = [
  {
    id: "mandelbrot",
    label: "Множество Мандельброта",
    description: "Классическая орбита z² + c, начинающаяся в нуле.",
    renderer: "escape-time",
    initialView: { center: [-0.65, 0], scale: 3.1 },
    preview: {
      view: { center: [-0.65, 0], scale: 3.1 },
      iterations: 240,
      palette: 0,
      colorDensity: 0.062,
    },
    suggestedIterations: 320,
    iterationControl: { label: "Итерации", min: 40, max: 1500, step: 10 },
    escapePower: 2,
    deepZoom: { backend: "mandelbrot-perturbation" },
    parameters: [],
    shader: {
      setup: `
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,
      iterate: `
        z = complexSquare(z) + c;
      `,
      escaped: "dot(z, z) > 4.0",
    },
  },
  {
    id: "julia",
    label: "Множество Жюлиа",
    description: "Та же квадратичная динамика с фиксированным параметром c.",
    renderer: "escape-time",
    initialView: { center: [0, 0], scale: 3.2 },
    preview: {
      view: { center: [0, 0], scale: 3.2 },
      iterations: 260,
      palette: 0,
      colorDensity: 0.062,
    },
    suggestedIterations: 360,
    iterationControl: { label: "Итерации", min: 40, max: 1500, step: 10 },
    escapePower: 2,
    parameters: [
      {
        key: "constant",
        label: "Константа c",
        uniform: "u_juliaConstant",
        type: "complex",
        defaultValue: [-0.745, 0.113],
        step: 0.001,
      },
    ],
    shader: {
      setup: `
        vec2 z = point;
        vec2 c = u_juliaConstant;
      `,
      iterate: `
        z = complexSquare(z) + c;
      `,
      escaped: "dot(z, z) > 4.0",
    },
  },
  {
    id: "burning-ship",
    label: "Burning Ship",
    description: "Перед возведением в квадрат обе координаты z берутся по модулю.",
    renderer: "escape-time",
    initialView: { center: [-0.45, -0.5], scale: 3.4 },
    preview: {
      view: { center: [-0.45, -0.5], scale: 3.4 },
      iterations: 260,
      palette: 2,
      colorDensity: 0.058,
    },
    suggestedIterations: 380,
    iterationControl: { label: "Итерации", min: 40, max: 1500, step: 10 },
    escapePower: 2,
    parameters: [],
    shader: {
      setup: `
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,
      iterate: `
        z = complexSquare(abs(z)) + c;
      `,
      escaped: "dot(z, z) > 4.0",
    },
  },
  {
    id: "tricorn",
    label: "Трикорн",
    description: "Антиголоморфный вариант Мандельброта: conjugate(z)² + c.",
    renderer: "escape-time",
    initialView: { center: [0, 0], scale: 3.5 },
    preview: {
      view: { center: [0, 0], scale: 3.5 },
      iterations: 240,
      palette: 1,
      colorDensity: 0.06,
    },
    suggestedIterations: 340,
    iterationControl: { label: "Итерации", min: 40, max: 1500, step: 10 },
    escapePower: 2,
    parameters: [],
    shader: {
      setup: `
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,
      iterate: `
        z = vec2(z.x * z.x - z.y * z.y, -2.0 * z.x * z.y) + c;
      `,
      escaped: "dot(z, z) > 4.0",
    },
  },
  {
    id: "phoenix",
    label: "Феникс",
    description: "Орбита с памятью: следующий шаг зависит от предыдущего z.",
    renderer: "escape-time",
    initialView: { center: [0, 0], scale: 3.2 },
    preview: {
      view: { center: [0, 0], scale: 3.2 },
      iterations: 280,
      palette: 0,
      colorDensity: 0.052,
    },
    suggestedIterations: 380,
    iterationControl: { label: "Итерации", min: 40, max: 1500, step: 10 },
    escapePower: 2,
    parameters: [
      {
        key: "constant",
        label: "Константа c",
        uniform: "u_phoenixConstant",
        type: "complex",
        defaultValue: [0.5667, 0],
        step: 0.001,
      },
      {
        key: "memory",
        label: "Память p",
        uniform: "u_phoenixMemory",
        type: "number",
        defaultValue: -0.5,
        step: 0.01,
      },
    ],
    shader: {
      setup: `
        vec2 z = point;
        vec2 previousZ = vec2(0.0);
      `,
      iterate: `
        vec2 nextZ = complexSquare(z) + u_phoenixConstant + u_phoenixMemory * previousZ;
        previousZ = z;
        z = nextZ;
      `,
      escaped: "dot(z, z) > 4.0",
    },
  },
  {
    id: "newton",
    label: "Newton",
    description: "Бассейны притяжения трёх корней полинома z³ − 1.",
    renderer: "root-basin",
    basinBackend: "newton-cubic",
    initialView: { center: [0, 0], scale: 4 },
    preview: {
      view: { center: [0, 0], scale: 4 },
      iterations: 70,
      palette: 0,
      colorDensity: 0.075,
    },
    suggestedIterations: 80,
    iterationControl: { label: "Итерации", min: 10, max: 300, step: 5 },
    parameters: [
      {
        key: "tolerance",
        label: "Допуск сходимости",
        uniform: "u_convergenceTolerance",
        type: "number",
        defaultValue: 0.00001,
        step: 0.00001,
        min: 0.0000001,
        max: 0.01,
      },
    ],
  },
  {
    id: "nova",
    label: "Nova",
    description: "Параметрическая плоскость метода Ньютона с добавлением координаты c.",
    renderer: "root-basin",
    basinBackend: "nova-cubic",
    initialView: { center: [0, 0], scale: 3.6 },
    preview: {
      view: { center: [0, 0], scale: 3.6 },
      iterations: 100,
      palette: 0,
      colorDensity: 0.075,
    },
    suggestedIterations: 120,
    iterationControl: { label: "Итерации", min: 20, max: 500, step: 5 },
    parameters: [
      {
        key: "relaxation",
        label: "Relaxation r",
        uniform: "u_novaRelaxation",
        type: "number",
        defaultValue: 1,
        step: 0.05,
        min: -2,
        max: 2,
      },
      {
        key: "escapeRadius",
        label: "Радиус выхода",
        uniform: "u_novaEscapeRadius",
        type: "number",
        defaultValue: 32,
        step: 1,
        min: 2,
        max: 256,
      },
      {
        key: "tolerance",
        label: "Допуск сходимости",
        uniform: "u_convergenceTolerance",
        type: "number",
        defaultValue: 0.00001,
        step: 0.00001,
        min: 0.0000001,
        max: 0.01,
      },
    ],
  },
  {
    id: "clifford",
    label: "Clifford attractor",
    description: "Хаотическая траектория, проявляющаяся через плотность накопленных точек.",
    renderer: "point-attractor",
    attractorBackend: "clifford",
    initialView: { center: [0, 0], scale: 4.8 },
    preview: {
      view: { center: [0, 0], scale: 4.8 },
      palette: 0,
      parameters: {
        pointCount: 180000,
        exposure: 0.11,
        pointSize: 1.25,
      },
    },
    suggestedIterations: 1,
    parameters: [
      {
        key: "a",
        label: "Параметр a",
        uniform: "u_cliffordA",
        type: "number",
        defaultValue: -1.4,
        step: 0.01,
        min: -3,
        max: 3,
      },
      {
        key: "b",
        label: "Параметр b",
        uniform: "u_cliffordB",
        type: "number",
        defaultValue: 1.6,
        step: 0.01,
        min: -3,
        max: 3,
      },
      {
        key: "c",
        label: "Параметр c",
        uniform: "u_cliffordC",
        type: "number",
        defaultValue: 1,
        step: 0.01,
        min: -3,
        max: 3,
      },
      {
        key: "d",
        label: "Параметр d",
        uniform: "u_cliffordD",
        type: "number",
        defaultValue: 0.7,
        step: 0.01,
        min: -3,
        max: 3,
      },
      {
        key: "burnIn",
        label: "Пропустить точек",
        uniform: "u_cliffordBurnIn",
        type: "number",
        defaultValue: 100,
        step: 50,
        min: 0,
        max: 100000,
      },
      {
        key: "pointCount",
        label: "Количество точек",
        uniform: "u_cliffordPointCount",
        type: "number",
        defaultValue: 500000,
        step: 50000,
        min: 1000,
        max: 2000000,
      },
      {
        key: "exposure",
        label: "Экспозиция",
        uniform: "u_cliffordExposure",
        type: "number",
        defaultValue: 0.045,
        step: 0.005,
        min: 0.005,
        max: 0.3,
        affectsOrbit: false,
      },
      {
        key: "pointSize",
        label: "Размер точки",
        uniform: "u_cliffordPointSize",
        type: "number",
        defaultValue: 1.25,
        step: 0.25,
        min: 1,
        max: 5,
        affectsOrbit: false,
      },
    ],
  },
];

export function createDefaultParameters(
  formula: FractalFormula,
): Record<string, FractalParameterValue> {
  return Object.fromEntries(
    formula.parameters.map((parameter) => [
      parameter.key,
      parameter.type === "complex"
        ? ([...parameter.defaultValue] as const)
        : parameter.defaultValue,
    ]),
  );
}
