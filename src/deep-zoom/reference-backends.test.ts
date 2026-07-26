import { describe, expect, it } from "vite-plus/test";
import type { ComplexValue, DeepZoomBackendId } from "../fractals/types.ts";
import {
  absolutePerturbationDelta,
  initialPerturbationState,
  iteratePerturbation,
  type NumericPerturbationState,
} from "./reference-backends.ts";

const ZERO: ComplexValue = [0, 0];

function add(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] + right[0], left[1] + right[1]];
}

function subtract(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] - right[0], left[1] - right[1]];
}

function multiply(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] * right[0] - left[1] * right[1], left[0] * right[1] + left[1] * right[0]];
}

function square(value: ComplexValue): ComplexValue {
  return multiply(value, value);
}

function conjugate(value: ComplexValue): ComplexValue {
  return [value[0], -value[1]];
}

function scale(value: ComplexValue, factor: number): ComplexValue {
  return [value[0] * factor, value[1] * factor];
}

function divide(numerator: ComplexValue, denominator: ComplexValue): ComplexValue {
  const denominatorSquared = denominator[0] * denominator[0] + denominator[1] * denominator[1];
  return [
    (numerator[0] * denominator[0] + numerator[1] * denominator[1]) / denominatorSquared,
    (numerator[1] * denominator[0] - numerator[0] * denominator[1]) / denominatorSquared,
  ];
}

function cubicCorrection(value: ComplexValue): ComplexValue {
  const squared = square(value);
  return divide(subtract(multiply(squared, value), [1, 0]), scale(squared, 3));
}

function expectComplex(actual: ComplexValue, expected: ComplexValue): void {
  expect(actual[0]).toBeCloseTo(expected[0], 14);
  expect(actual[1]).toBeCloseTo(expected[1], 14);
}

function state(current: ComplexValue, previous: ComplexValue = ZERO): NumericPerturbationState {
  return { current, previous };
}

describe("perturbation backends", () => {
  it("preserves a tiny Burning Ship delta without subtracting close absolute values", () => {
    expect(Math.abs(1e20 + 1) - Math.abs(1e20)).toBe(0);
    expect(absolutePerturbationDelta(1e20, 1)).toBe(1);
    expect(absolutePerturbationDelta(-1e20, 1)).toBe(-1);
  });

  it("handles Burning Ship sign-boundary crossings exactly", () => {
    expect(absolutePerturbationDelta(0.01, -0.03)).toBeCloseTo(0.01, 14);
    expect(absolutePerturbationDelta(-0.01, 0.03)).toBeCloseTo(0.01, 14);
    expect(absolutePerturbationDelta(0, -0.03)).toBe(0.03);
  });

  it.each([
    ["julia-perturbation", [0.01, -0.02]],
    ["phoenix-perturbation", [0.01, -0.02]],
    ["mandelbrot-perturbation", ZERO],
    ["tricorn-perturbation", ZERO],
    ["burning-ship-perturbation", ZERO],
    ["newton-cubic-perturbation", [0.01, -0.02]],
    ["nova-cubic-perturbation", ZERO],
  ] satisfies readonly (readonly [DeepZoomBackendId, ComplexValue])[])(
    "uses the correct initial delta for %s",
    (backend, expected) => {
      expect(initialPerturbationState(backend, [0.01, -0.02]).current).toEqual(expected);
    },
  );

  it("matches a direct Mandelbrot step", () => {
    const reference = state([0.2, 0.3]);
    const delta = state([0.01, -0.02]);
    const planeDelta: ComplexValue = [0.001, 0.002];
    const result = iteratePerturbation("mandelbrot-perturbation", reference, delta, planeDelta, {});
    const expected = add(
      subtract(square(add(reference.current, delta.current)), square(reference.current)),
      planeDelta,
    );

    expectComplex(result.current, expected);
  });

  it("matches a direct Julia step without a plane-parameter delta", () => {
    const reference = state([-0.4, 0.2]);
    const delta = state([0.003, -0.005]);
    const result = iteratePerturbation("julia-perturbation", reference, delta, ZERO, {
      constant: [-0.745, 0.113],
    });
    const expected = subtract(
      square(add(reference.current, delta.current)),
      square(reference.current),
    );

    expectComplex(result.current, expected);
  });

  it("matches a direct conjugated Tricorn step", () => {
    const reference = state([-0.25, 0.4]);
    const delta = state([0.006, 0.002]);
    const planeDelta: ComplexValue = [-0.001, 0.003];
    const result = iteratePerturbation("tricorn-perturbation", reference, delta, planeDelta, {});
    const expected = add(
      subtract(
        square(conjugate(add(reference.current, delta.current))),
        square(conjugate(reference.current)),
      ),
      planeDelta,
    );

    expectComplex(result.current, expected);
  });

  it("matches a direct Burning Ship step across a sign boundary", () => {
    const reference = state([-0.01, 0.4]);
    const delta = state([0.02, -0.03]);
    const planeDelta: ComplexValue = [0.001, -0.002];
    const result = iteratePerturbation(
      "burning-ship-perturbation",
      reference,
      delta,
      planeDelta,
      {},
    );
    const transform = (value: ComplexValue): ComplexValue => [
      Math.abs(value[0]),
      Math.abs(value[1]),
    ];
    const expected = add(
      subtract(
        square(transform(add(reference.current, delta.current))),
        square(transform(reference.current)),
      ),
      planeDelta,
    );

    expectComplex(result.current, expected);
  });

  it("carries the previous delta through a Phoenix step", () => {
    const reference = state([0.2, 0.1], [-0.1, 0.05]);
    const delta = state([0.01, -0.02], [0.004, 0.003]);
    const memory = -0.5;
    const result = iteratePerturbation("phoenix-perturbation", reference, delta, ZERO, {
      constant: [0.5667, 0],
      memory,
    });
    const expected = add(
      subtract(square(add(reference.current, delta.current)), square(reference.current)),
      scale(delta.previous, memory),
    );

    expectComplex(result.current, expected);
    expect(result.previous).toEqual(delta.current);
  });

  it("matches a direct cubic Newton step", () => {
    const reference = state([0.8, 0.3]);
    const delta = state([0.002, -0.004]);
    const result = iteratePerturbation("newton-cubic-perturbation", reference, delta, ZERO, {});
    const newtonStep = (value: ComplexValue): ComplexValue =>
      subtract(value, cubicCorrection(value));
    const expected = subtract(
      newtonStep(add(reference.current, delta.current)),
      newtonStep(reference.current),
    );

    expectComplex(result.current, expected);
  });

  it("matches a direct Nova step including the plane delta", () => {
    const reference = state([1.2, -0.1]);
    const delta = state([-0.003, 0.005]);
    const planeDelta: ComplexValue = [0.0002, -0.0004];
    const relaxation = 0.85;
    const result = iteratePerturbation("nova-cubic-perturbation", reference, delta, planeDelta, {
      relaxation,
    });
    const novaStep = (value: ComplexValue, planePoint: ComplexValue): ComplexValue =>
      add(subtract(value, scale(cubicCorrection(value), relaxation)), planePoint);
    const referencePlanePoint: ComplexValue = [0.1, 0.02];
    const expected = subtract(
      novaStep(add(reference.current, delta.current), add(referencePlanePoint, planeDelta)),
      novaStep(reference.current, referencePlanePoint),
    );

    expectComplex(result.current, expected);
  });
});
