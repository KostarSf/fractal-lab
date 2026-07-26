import Decimal from "decimal.js";
import type { ComplexValue, DeepZoomBackendId, FractalParameterValue } from "../fractals/types.ts";

export interface PreciseComplex {
  readonly real: Decimal;
  readonly imaginary: Decimal;
}

export interface ReferenceState {
  readonly current: PreciseComplex;
  readonly previous: PreciseComplex;
}

interface ReferenceBackend {
  readonly texelsPerIteration: 1 | 2;
  initialize(
    D: Decimal.Constructor,
    planePoint: PreciseComplex,
    parameters: Readonly<Record<string, FractalParameterValue>>,
  ): ReferenceState;
  iterate(
    D: Decimal.Constructor,
    state: ReferenceState,
    planePoint: PreciseComplex,
    parameters: Readonly<Record<string, FractalParameterValue>>,
  ): ReferenceState | undefined;
}

const ZERO_COMPLEX_PARAMETER = [0, 0] as const;

function zero(D: Decimal.Constructor): PreciseComplex {
  return {
    real: new D(0),
    imaginary: new D(0),
  };
}

function complexParameter(
  D: Decimal.Constructor,
  parameters: Readonly<Record<string, FractalParameterValue>>,
  key: string,
  fallback: ComplexValue,
): PreciseComplex {
  const value = parameters[key];
  const complex = Array.isArray(value) && value.length === 2 ? value : fallback;
  return {
    real: new D(complex[0]),
    imaginary: new D(complex[1]),
  };
}

function numberParameter(
  D: Decimal.Constructor,
  parameters: Readonly<Record<string, FractalParameterValue>>,
  key: string,
  fallback: number,
): Decimal {
  const value = parameters[key];
  return new D(typeof value === "number" && Number.isFinite(value) ? value : fallback);
}

function add(left: PreciseComplex, right: PreciseComplex): PreciseComplex {
  return {
    real: left.real.plus(right.real),
    imaginary: left.imaginary.plus(right.imaginary),
  };
}

function subtract(left: PreciseComplex, right: PreciseComplex): PreciseComplex {
  return {
    real: left.real.minus(right.real),
    imaginary: left.imaginary.minus(right.imaginary),
  };
}

function multiply(left: PreciseComplex, right: PreciseComplex): PreciseComplex {
  return {
    real: left.real.times(right.real).minus(left.imaginary.times(right.imaginary)),
    imaginary: left.real.times(right.imaginary).plus(left.imaginary.times(right.real)),
  };
}

function multiplyScalar(value: PreciseComplex, scalar: Decimal): PreciseComplex {
  return {
    real: value.real.times(scalar),
    imaginary: value.imaginary.times(scalar),
  };
}

function square(value: PreciseComplex): PreciseComplex {
  return {
    real: value.real.times(value.real).minus(value.imaginary.times(value.imaginary)),
    imaginary: value.real.times(value.imaginary).times(2),
  };
}

function divide(
  numerator: PreciseComplex,
  denominator: PreciseComplex,
): PreciseComplex | undefined {
  const denominatorSquared = denominator.real
    .times(denominator.real)
    .plus(denominator.imaginary.times(denominator.imaginary));
  if (denominatorSquared.isZero()) {
    return undefined;
  }

  return {
    real: numerator.real
      .times(denominator.real)
      .plus(numerator.imaginary.times(denominator.imaginary))
      .dividedBy(denominatorSquared),
    imaginary: numerator.imaginary
      .times(denominator.real)
      .minus(numerator.real.times(denominator.imaginary))
      .dividedBy(denominatorSquared),
  };
}

function cubicCorrection(
  D: Decimal.Constructor,
  value: PreciseComplex,
): PreciseComplex | undefined {
  const squared = square(value);
  const cubed = multiply(squared, value);
  return divide(
    {
      real: cubed.real.minus(1),
      imaginary: cubed.imaginary,
    },
    multiplyScalar(squared, new D(3)),
  );
}

function conjugateSquare(value: PreciseComplex): PreciseComplex {
  const result = square(value);
  return {
    real: result.real,
    imaginary: result.imaginary.negated(),
  };
}

function burningShipSquare(value: PreciseComplex): PreciseComplex {
  return square({
    real: value.real.absoluteValue(),
    imaginary: value.imaginary.absoluteValue(),
  });
}

const REFERENCE_BACKENDS = {
  "mandelbrot-perturbation": {
    texelsPerIteration: 1,
    initialize(D) {
      const initial = zero(D);
      return { current: initial, previous: initial };
    },
    iterate(_D, state, planePoint) {
      return {
        current: add(square(state.current), planePoint),
        previous: state.current,
      };
    },
  },
  "julia-perturbation": {
    texelsPerIteration: 1,
    initialize(D, planePoint) {
      return { current: planePoint, previous: zero(D) };
    },
    iterate(D, state, _planePoint, parameters) {
      const constant = complexParameter(D, parameters, "constant", [-0.745, 0.113]);
      return {
        current: add(square(state.current), constant),
        previous: state.current,
      };
    },
  },
  "tricorn-perturbation": {
    texelsPerIteration: 1,
    initialize(D) {
      const initial = zero(D);
      return { current: initial, previous: initial };
    },
    iterate(_D, state, planePoint) {
      return {
        current: add(conjugateSquare(state.current), planePoint),
        previous: state.current,
      };
    },
  },
  "burning-ship-perturbation": {
    texelsPerIteration: 1,
    initialize(D) {
      const initial = zero(D);
      return { current: initial, previous: initial };
    },
    iterate(_D, state, planePoint) {
      return {
        current: add(burningShipSquare(state.current), planePoint),
        previous: state.current,
      };
    },
  },
  "phoenix-perturbation": {
    texelsPerIteration: 2,
    initialize(D, planePoint) {
      return { current: planePoint, previous: zero(D) };
    },
    iterate(D, state, _planePoint, parameters) {
      const constant = complexParameter(D, parameters, "constant", [0.5667, 0]);
      const memory = numberParameter(D, parameters, "memory", -0.5);
      return {
        current: add(add(square(state.current), constant), multiplyScalar(state.previous, memory)),
        previous: state.current,
      };
    },
  },
  "newton-cubic-perturbation": {
    texelsPerIteration: 1,
    initialize(_D, planePoint) {
      return { current: planePoint, previous: planePoint };
    },
    iterate(D, state) {
      const correction = cubicCorrection(D, state.current);
      if (!correction) {
        return undefined;
      }
      return {
        current: subtract(state.current, correction),
        previous: state.current,
      };
    },
  },
  "nova-cubic-perturbation": {
    texelsPerIteration: 1,
    initialize(D) {
      const initial = {
        real: new D(1),
        imaginary: new D(0),
      };
      return { current: initial, previous: initial };
    },
    iterate(D, state, planePoint, parameters) {
      const correction = cubicCorrection(D, state.current);
      if (!correction) {
        return undefined;
      }
      const relaxation = numberParameter(D, parameters, "relaxation", 1);
      return {
        current: add(subtract(state.current, multiplyScalar(correction, relaxation)), planePoint),
        previous: state.current,
      };
    },
  },
} as const satisfies Record<DeepZoomBackendId, ReferenceBackend>;

export function getReferenceBackend(backend: DeepZoomBackendId): ReferenceBackend {
  return REFERENCE_BACKENDS[backend];
}

export function createPlanePoint(
  D: Decimal.Constructor,
  value: readonly [string, string],
): PreciseComplex {
  return {
    real: new D(value[0]),
    imaginary: new D(value[1]),
  };
}

export function referenceMagnitudeSquared(state: ReferenceState): Decimal {
  return state.current.real
    .times(state.current.real)
    .plus(state.current.imaginary.times(state.current.imaginary));
}

function splitFloat64(value: number): readonly [high: number, low: number] {
  const high = Math.fround(value);
  return [high, Math.fround(value - high)];
}

function packComplex(target: Float32Array, offset: number, value: PreciseComplex): void {
  const [realHigh, realLow] = splitFloat64(value.real.toNumber());
  const [imaginaryHigh, imaginaryLow] = splitFloat64(value.imaginary.toNumber());
  target[offset] = realHigh;
  target[offset + 1] = imaginaryHigh;
  target[offset + 2] = realLow;
  target[offset + 3] = imaginaryLow;
}

export function packReferenceState(
  target: Float32Array,
  iteration: number,
  texelsPerIteration: number,
  state: ReferenceState,
): void {
  const offset = iteration * texelsPerIteration * 4;
  packComplex(target, offset, state.current);
  if (texelsPerIteration > 1) {
    packComplex(target, offset + 4, state.previous);
  }
}

export interface NumericPerturbationState {
  readonly current: ComplexValue;
  readonly previous: ComplexValue;
}

function numericAdd(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] + right[0], left[1] + right[1]];
}

function numericMultiply(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] * right[0] - left[1] * right[1], left[0] * right[1] + left[1] * right[0]];
}

function numericSquare(value: ComplexValue): ComplexValue {
  return numericMultiply(value, value);
}

function numericScale(value: ComplexValue, scalar: number): ComplexValue {
  return [value[0] * scalar, value[1] * scalar];
}

function numericSubtract(left: ComplexValue, right: ComplexValue): ComplexValue {
  return [left[0] - right[0], left[1] - right[1]];
}

function numericDivide(numerator: ComplexValue, denominator: ComplexValue): ComplexValue {
  const denominatorSquared = denominator[0] * denominator[0] + denominator[1] * denominator[1];
  return [
    (numerator[0] * denominator[0] + numerator[1] * denominator[1]) / denominatorSquared,
    (numerator[1] * denominator[0] - numerator[0] * denominator[1]) / denominatorSquared,
  ];
}

function numericConjugate(value: ComplexValue): ComplexValue {
  return [value[0], -value[1]];
}

export function absolutePerturbationDelta(reference: number, delta: number): number {
  const actual = reference + delta;
  if (reference > 0) {
    return actual >= 0 ? delta : -2 * reference - delta;
  }
  if (reference < 0) {
    return actual <= 0 ? -delta : 2 * reference + delta;
  }
  return Math.abs(delta);
}

/**
 * CPU mirror of one GPU perturbation step. It is intentionally small and is
 * used by unit tests to lock the formula-specific recurrences to the reference
 * backend contract.
 */
export function iteratePerturbation(
  backend: DeepZoomBackendId,
  reference: NumericPerturbationState,
  delta: NumericPerturbationState,
  planeDelta: ComplexValue,
  parameters: Readonly<Record<string, FractalParameterValue>>,
): NumericPerturbationState {
  if (backend === "newton-cubic-perturbation" || backend === "nova-cubic-perturbation") {
    const actual = numericAdd(reference.current, delta.current);
    const numerator = numericMultiply(
      delta.current,
      numericAdd(numericScale(reference.current, 2), delta.current),
    );
    const denominator = numericMultiply(numericSquare(reference.current), numericSquare(actual));
    const reciprocalDifference = numericDivide(numerator, denominator);
    const correctionDelta = numericScale(numericAdd(delta.current, reciprocalDifference), 1 / 3);
    const relaxationValue = parameters.relaxation;
    const relaxation =
      backend === "nova-cubic-perturbation" &&
      typeof relaxationValue === "number" &&
      Number.isFinite(relaxationValue)
        ? relaxationValue
        : 1;
    const next = numericSubtract(delta.current, numericScale(correctionDelta, relaxation));
    return {
      current: backend === "nova-cubic-perturbation" ? numericAdd(next, planeDelta) : next,
      previous: delta.current,
    };
  }

  if (backend === "phoenix-perturbation") {
    const memoryValue = parameters.memory;
    const memory =
      typeof memoryValue === "number" && Number.isFinite(memoryValue) ? memoryValue : -0.5;
    return {
      current: numericAdd(
        numericAdd(
          numericScale(numericMultiply(reference.current, delta.current), 2),
          numericSquare(delta.current),
        ),
        numericScale(delta.previous, memory),
      ),
      previous: delta.current,
    };
  }

  if (backend === "tricorn-perturbation") {
    const conjugateReference = numericConjugate(reference.current);
    const conjugateDelta = numericConjugate(delta.current);
    return {
      current: numericAdd(
        numericAdd(
          numericScale(numericMultiply(conjugateReference, conjugateDelta), 2),
          numericSquare(conjugateDelta),
        ),
        planeDelta,
      ),
      previous: delta.current,
    };
  }

  if (backend === "burning-ship-perturbation") {
    const transformedReference: ComplexValue = [
      Math.abs(reference.current[0]),
      Math.abs(reference.current[1]),
    ];
    const transformedDelta: ComplexValue = [
      absolutePerturbationDelta(reference.current[0], delta.current[0]),
      absolutePerturbationDelta(reference.current[1], delta.current[1]),
    ];
    return {
      current: numericAdd(
        numericAdd(
          numericScale(numericMultiply(transformedReference, transformedDelta), 2),
          numericSquare(transformedDelta),
        ),
        planeDelta,
      ),
      previous: delta.current,
    };
  }

  const next = numericAdd(
    numericScale(numericMultiply(reference.current, delta.current), 2),
    numericSquare(delta.current),
  );
  return {
    current: backend === "mandelbrot-perturbation" ? numericAdd(next, planeDelta) : next,
    previous: delta.current,
  };
}

export function initialPerturbationState(
  backend: DeepZoomBackendId,
  planeDelta: ComplexValue,
): NumericPerturbationState {
  return {
    current:
      backend === "julia-perturbation" ||
      backend === "phoenix-perturbation" ||
      backend === "newton-cubic-perturbation"
        ? planeDelta
        : ZERO_COMPLEX_PARAMETER,
    previous: ZERO_COMPLEX_PARAMETER,
  };
}
