import type { FractalFormula, FractalParameterValue } from "./types.ts";

export const FRACTAL_FORMULAS: readonly FractalFormula[] = [
  {
    id: "mandelbrot",
    label: "Множество Мандельброта",
    description: "Классическая орбита z² + c, начинающаяся в нуле.",
    initialView: { center: [-0.65, 0], scale: 3.1 },
    suggestedIterations: 320,
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
    initialView: { center: [0, 0], scale: 3.2 },
    suggestedIterations: 360,
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
    initialView: { center: [-0.45, -0.5], scale: 3.4 },
    suggestedIterations: 380,
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
    initialView: { center: [0, 0], scale: 3.5 },
    suggestedIterations: 340,
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
    initialView: { center: [0, 0], scale: 3.2 },
    suggestedIterations: 380,
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
