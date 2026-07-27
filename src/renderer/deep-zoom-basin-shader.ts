import type { RootBasinDeepZoomBackendId } from "../fractals/types.ts";

const MAX_ITERATIONS = 2_048;

function backendUniforms(backend: RootBasinDeepZoomBackendId): string {
  if (backend === "newton-cubic-perturbation") {
    return "uniform float u_convergenceTolerance;";
  }

  return `
uniform float u_novaRelaxation;
uniform float u_novaEscapeRadius;
uniform float u_convergenceTolerance;
`;
}

function novaPrecisionCode(backend: RootBasinDeepZoomBackendId): string {
  if (backend !== "nova-cubic-perturbation") {
    return "";
  }

  return `
// Complex double-single values use the same layout as the reference texture:
// high real/imaginary components in xy and their low residuals in zw.
vec4 preciseComplex(vec2 value) {
  return vec4(value, 0.0, 0.0);
}

vec2 preciseScalarAdd(vec2 left, vec2 right) {
  float sum = left.x + right.x;
  float virtualRight = sum - left.x;
  float error =
    (left.x - (sum - virtualRight)) +
    (right.x - virtualRight) +
    left.y +
    right.y;
  float high = sum + error;
  return vec2(high, error - (high - sum));
}

vec2 preciseScalarMultiply(vec2 left, vec2 right) {
  const float SPLITTER = 4097.0;
  float product = left.x * right.x;

  float leftSplit = SPLITTER * left.x;
  float leftHigh = leftSplit - (leftSplit - left.x);
  float leftLow = left.x - leftHigh;
  float rightSplit = SPLITTER * right.x;
  float rightHigh = rightSplit - (rightSplit - right.x);
  float rightLow = right.x - rightHigh;

  float error =
    ((leftHigh * rightHigh - product) +
      leftHigh * rightLow +
      leftLow * rightHigh) +
    leftLow * rightLow;
  error += left.x * right.y + left.y * right.x + left.y * right.y;
  float high = product + error;
  return vec2(high, error - (high - product));
}

vec2 preciseScalarDivide(vec2 numerator, vec2 denominator) {
  float estimate = numerator.x / denominator.x;
  vec2 remainder = preciseScalarAdd(
    numerator,
    -preciseScalarMultiply(denominator, vec2(estimate, 0.0))
  );
  float refinement = (remainder.x + remainder.y) / denominator.x;
  return preciseScalarAdd(
    vec2(estimate, 0.0),
    vec2(refinement, 0.0)
  );
}

vec4 packPreciseComplex(vec2 realPart, vec2 imaginaryPart) {
  return vec4(
    realPart.x,
    imaginaryPart.x,
    realPart.y,
    imaginaryPart.y
  );
}

vec4 preciseComplexAdd(vec4 left, vec4 right) {
  return packPreciseComplex(
    preciseScalarAdd(left.xz, right.xz),
    preciseScalarAdd(left.yw, right.yw)
  );
}

vec4 preciseComplexSubtract(vec4 left, vec4 right) {
  return preciseComplexAdd(left, -right);
}

vec4 preciseComplexMultiply(vec4 left, vec4 right) {
  vec2 realPart = preciseScalarAdd(
    preciseScalarMultiply(left.xz, right.xz),
    -preciseScalarMultiply(left.yw, right.yw)
  );
  vec2 imaginaryPart = preciseScalarAdd(
    preciseScalarMultiply(left.xz, right.yw),
    preciseScalarMultiply(left.yw, right.xz)
  );
  return packPreciseComplex(realPart, imaginaryPart);
}

vec4 preciseComplexScale(vec4 value, float scalar) {
  vec2 preciseScalar = vec2(scalar, 0.0);
  return packPreciseComplex(
    preciseScalarMultiply(value.xz, preciseScalar),
    preciseScalarMultiply(value.yw, preciseScalar)
  );
}

vec2 materializePreciseComplex(vec4 value) {
  return value.xy + value.zw;
}

bool preciseComplexDivide(
  vec4 numerator,
  vec4 denominator,
  out vec4 quotient
) {
  vec2 denominatorApproximation = materializePreciseComplex(denominator);
  float denominatorScale = maxNorm(denominatorApproximation);
  if (
    denominatorScale == 0.0 ||
    isnan(denominatorScale) ||
    isinf(denominatorScale)
  ) {
    return false;
  }

  float inverseScale = 1.0 / denominatorScale;
  vec4 normalizedNumerator = preciseComplexScale(
    numerator,
    inverseScale
  );
  vec4 normalizedDenominator = preciseComplexScale(
    denominator,
    inverseScale
  );
  vec2 denominatorSquared = preciseScalarAdd(
    preciseScalarMultiply(
      normalizedDenominator.xz,
      normalizedDenominator.xz
    ),
    preciseScalarMultiply(
      normalizedDenominator.yw,
      normalizedDenominator.yw
    )
  );
  if (denominatorSquared.x == 0.0) {
    return false;
  }

  vec2 realNumerator = preciseScalarAdd(
    preciseScalarMultiply(
      normalizedNumerator.xz,
      normalizedDenominator.xz
    ),
    preciseScalarMultiply(
      normalizedNumerator.yw,
      normalizedDenominator.yw
    )
  );
  vec2 imaginaryNumerator = preciseScalarAdd(
    preciseScalarMultiply(
      normalizedNumerator.yw,
      normalizedDenominator.xz
    ),
    -preciseScalarMultiply(
      normalizedNumerator.xz,
      normalizedDenominator.yw
    )
  );
  quotient = packPreciseComplex(
    preciseScalarDivide(realNumerator, denominatorSquared),
    preciseScalarDivide(imaginaryNumerator, denominatorSquared)
  );
  vec2 approximation = materializePreciseComplex(quotient);
  return !any(isnan(approximation)) && !any(isinf(approximation));
}

bool calculatePreciseCorrectionDelta(
  vec4 reference,
  vec4 delta,
  out vec4 correctionDelta
) {
  vec4 actual = preciseComplexAdd(reference, delta);
  vec4 numerator = preciseComplexAdd(
    preciseComplexScale(reference, 2.0),
    delta
  );
  vec4 denominator = preciseComplexMultiply(
    preciseComplexMultiply(reference, reference),
    preciseComplexMultiply(actual, actual)
  );
  vec4 reciprocalTerm;
  if (!preciseComplexDivide(numerator, denominator, reciprocalTerm)) {
    return false;
  }

  vec4 factor = preciseComplexScale(
    preciseComplexAdd(
      preciseComplex(vec2(1.0, 0.0)),
      reciprocalTerm
    ),
    1.0 / 3.0
  );
  correctionDelta = preciseComplexMultiply(delta, factor);
  vec2 approximation = materializePreciseComplex(correctionDelta);
  return !any(isnan(approximation)) && !any(isinf(approximation));
}
`;
}

function iterationCode(backend: RootBasinDeepZoomBackendId): string {
  if (backend === "newton-cubic-perturbation") {
    return `
  // Newton has no additive plane delta after the initial step. Keep its
  // perturbation normalized so a contracting prefix cannot flush it to zero
  // before a later expanding part of the orbit.
  const float INITIAL_DELTA_EXPONENT = -96.0;
  const float INITIAL_DELTA_SCALE = 7.922816251426434e28;
  vec2 deltaMantissa =
    u_centerDelta * INITIAL_DELTA_SCALE +
    pixel * ((u_scale * INITIAL_DELTA_SCALE) / u_resolution.y);
  float deltaExponent = INITIAL_DELTA_EXPONENT;
  normalizeExtendedDelta(deltaMantissa, deltaExponent);
  vec2 deltaCurrent = materializeExtendedDelta(deltaMantissa, deltaExponent);
  vec4 referenceStart = fetchReference(0);
  vec2 actualZ = addReference(referenceStart, deltaCurrent);
  bool useDirectExtendedOrbit =
    u_scale < 1e-16 &&
    maxNorm(combineReference(referenceStart)) <= 4.0 * u_scale;
  vec2 directMantissa = vec2(0.0);
  float directExponent = 0.0;
  if (useDirectExtendedOrbit) {
    directMantissa = referenceStart.xy;
    normalizeExtendedDelta(directMantissa, directExponent);
    vec2 directLowMantissa = referenceStart.zw;
    float directLowExponent = 0.0;
    normalizeExtendedDelta(directLowMantissa, directLowExponent);
    vec2 combinedDirectMantissa;
    float combinedDirectExponent;
    addExtendedValues(
      directMantissa,
      directExponent,
      directLowMantissa,
      directLowExponent,
      combinedDirectMantissa,
      combinedDirectExponent
    );
    directMantissa = combinedDirectMantissa;
    directExponent = combinedDirectExponent;
    addExtendedValues(
      directMantissa,
      directExponent,
      deltaMantissa,
      deltaExponent,
      combinedDirectMantissa,
      combinedDirectExponent
    );
    directMantissa = combinedDirectMantissa;
    directExponent = combinedDirectExponent;
  }
  vec2 previousZ = actualZ;
  bool hasPreviousZ = false;
  int referenceIndex = 0;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  int convergenceRefinementSteps = 0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);

  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    if (useDirectExtendedOrbit) {
      bool directIsMaterialized =
        directExponent >= -62.0 &&
        directExponent <= 120.0;
      vec2 directCurrent = directIsMaterialized
        ? materializeExtendedDelta(directMantissa, directExponent)
        : vec2(0.0);
      vec2 correction = vec2(1e20, 0.0);
      bool hasCorrection =
        directIsMaterialized &&
        calculateNewtonCorrection(directCurrent, correction);
      vec2 nextDirectMantissa;
      float nextDirectExponent;
      if (
        !iterateExtendedNewton(
          directMantissa,
          directExponent,
          nextDirectMantissa,
          nextDirectExponent
        )
      ) {
        break;
      }

      iteration = i;
      finalMetric = hasCorrection
        ? stableComplexMagnitude(correction)
        : 1e20;
      if (
        hasCorrection &&
        dot(correction, correction) <=
          u_convergenceTolerance * u_convergenceTolerance
      ) {
        actualZ = materializeExtendedDelta(
          nextDirectMantissa,
          nextDirectExponent
        );
        rootIndex = nearestRoot(actualZ);
        vec2 root = cubicRoot(rootIndex);
        vec2 localError = directCurrent - root;
        if (hasPreviousZ) {
          localError = iterateNewtonLocalError(previousZ - root, root);
        }
        localError = iterateNewtonLocalError(localError, root);
        finalMetric = stableComplexMagnitude(localError);
        convergenceRefinementSteps = 1;
        resultKind = 1;
        break;
      }

      if (directIsMaterialized) {
        previousZ = directCurrent;
        hasPreviousZ = true;
      }
      directMantissa = nextDirectMantissa;
      directExponent = nextDirectExponent;
      continue;
    }

    vec4 referenceCurrent = fetchReference(referenceIndex);
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 correction;
    if (!calculateNewtonCorrection(actualCurrent, correction)) {
      break;
    }

    vec2 nextDeltaMantissa;
    float nextDeltaExponent;
    if (
      !calculateNextNewtonDelta(
        referenceCurrent,
        deltaCurrent,
        deltaMantissa,
        deltaExponent,
        nextDeltaMantissa,
        nextDeltaExponent
      )
    ) {
      break;
    }

    vec2 nextDeltaCurrent = materializeExtendedDelta(
      nextDeltaMantissa,
      nextDeltaExponent
    );
    int nextReferenceIndex = referenceIndex + 1;
    if (nextReferenceIndex >= u_referenceCount) {
      break;
    }
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex);
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    iteration = i;
    finalMetric = length(correction);

    if (dot(correction, correction) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(actualZ);
      vec2 root = cubicRoot(rootIndex);
      vec2 localError = actualCurrent - root;
      if (hasPreviousZ) {
        localError = iterateNewtonLocalError(previousZ - root, root);
      }
      localError = iterateNewtonLocalError(localError, root);
      finalMetric = stableComplexMagnitude(localError);
      convergenceRefinementSteps = 1;
      resultKind = 1;
      break;
    }

    previousZ = actualCurrent;
    hasPreviousZ = true;
    deltaMantissa = nextDeltaMantissa;
    deltaExponent = nextDeltaExponent;
    deltaCurrent = nextDeltaCurrent;
    referenceIndex = nextReferenceIndex;
  }
`;
  }

  return `
  vec4 planeDeltaPrecise = preciseComplex(planeDelta);
  vec4 deltaCurrentPrecise = preciseComplex(vec2(0.0));
  vec4 actualZPrecise = preciseComplexAdd(
    fetchReference(0),
    deltaCurrentPrecise
  );
  vec2 actualZ = materializePreciseComplex(actualZPrecise);
  int referenceIndex = 0;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  float previousMetric = 1.0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);
  bool hasPreviousMetric = false;
  float escapeRadiusSquared = u_novaEscapeRadius * u_novaEscapeRadius;

  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec4 referenceCurrent = fetchReference(referenceIndex);
    vec4 actualCurrentPrecise = preciseComplexAdd(
      referenceCurrent,
      deltaCurrentPrecise
    );
    vec4 correctionDeltaPrecise;
    if (
      !calculatePreciseCorrectionDelta(
        referenceCurrent,
        deltaCurrentPrecise,
        correctionDeltaPrecise
      )
    ) {
      break;
    }

    vec4 nextDeltaCurrentPrecise = preciseComplexAdd(
      preciseComplexSubtract(
        deltaCurrentPrecise,
        preciseComplexScale(
          correctionDeltaPrecise,
          u_novaRelaxation
        )
      ),
      planeDeltaPrecise
    );
    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex);
    actualZPrecise = preciseComplexAdd(
      nextReferenceCurrent,
      nextDeltaCurrentPrecise
    );
    actualZ = materializePreciseComplex(actualZPrecise);
    vec2 stepDelta = materializePreciseComplex(
      preciseComplexSubtract(
        actualZPrecise,
        actualCurrentPrecise
      )
    );
    iteration = i;
    finalMetric = stableComplexMagnitude(stepDelta);

    if (dot(actualZ, actualZ) > escapeRadiusSquared) {
      previousMetric = stableComplexMagnitude(
        materializePreciseComplex(actualCurrentPrecise)
      );
      finalMetric = stableComplexMagnitude(actualZ);
      smoothingThreshold = max(u_novaEscapeRadius, 1e-12);
      hasPreviousMetric = true;
      resultKind = 2;
      break;
    }
    if (dot(stepDelta, stepDelta) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(actualZ);
      resultKind = 1;
      break;
    }

    previousMetric = finalMetric;
    hasPreviousMetric = true;
    bool referenceExhausted = nextReferenceIndex >= u_referenceCount - 1;
    bool closerToCriticalPoint =
      maxNorm(actualZ) <
      maxNorm(materializePreciseComplex(nextDeltaCurrentPrecise));
    if (referenceExhausted || closerToCriticalPoint) {
      deltaCurrentPrecise = preciseComplexSubtract(
        actualZPrecise,
        fetchReference(0)
      );
      referenceIndex = 0;
    } else {
      deltaCurrentPrecise = nextDeltaCurrentPrecise;
      referenceIndex = nextReferenceIndex;
    }
  }
`;
}

function smoothingCode(backend: RootBasinDeepZoomBackendId): string {
  if (backend === "newton-cubic-perturbation") {
    return `
    colorIteration += quadraticConvergencePhase(
      finalMetric,
      smoothingThreshold,
      convergenceRefinementSteps
    );
`;
  }

  return `
    colorIteration += hasPreviousMetric
      ? thresholdCrossingPhase(previousMetric, finalMetric, smoothingThreshold)
      : 1.0;
`;
}

export function createDeepZoomBasinFragmentShader(backend: RootBasinDeepZoomBackendId): string {
  return `#version 300 es
precision highp float;
precision highp sampler2D;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_centerDelta;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;
uniform sampler2D u_referenceOrbit;
uniform int u_referenceCount;
${backendUniforms(backend)}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
  );
}

vec2 complexMultiply(vec2 left, vec2 right) {
  return vec2(
    left.x * right.x - left.y * right.y,
    left.x * right.y + left.y * right.x
  );
}

vec2 complexDivide(vec2 numerator, vec2 denominator, float denominatorSquared) {
  return vec2(
    dot(numerator, denominator),
    numerator.y * denominator.x - numerator.x * denominator.y
  ) / denominatorSquared;
}

vec4 fetchReference(int index) {
  return texelFetch(u_referenceOrbit, ivec2(0, index), 0);
}

vec2 combineReference(vec4 reference) {
  return reference.xy + reference.zw;
}

vec2 addReference(vec4 reference, vec2 delta) {
  return reference.xy + (reference.zw + delta);
}

vec2 subtractReference(vec2 actual, vec4 reference) {
  return (actual - reference.xy) - reference.zw;
}

float maxNorm(vec2 value) {
  return max(abs(value.x), abs(value.y));
}

${novaPrecisionCode(backend)}

void normalizeExtendedDelta(
  inout vec2 mantissa,
  inout float exponent
) {
  float magnitude = maxNorm(mantissa);
  if (magnitude == 0.0) {
    exponent = 0.0;
    return;
  }

  float shift = floor(log2(magnitude));
  mantissa *= exp2(-shift);
  exponent += shift;
}

vec2 materializeExtendedDelta(vec2 mantissa, float exponent) {
  if (exponent < -120.0) {
    return vec2(0.0);
  }
  return mantissa * exp2(exponent);
}

bool stableComplexDivide(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorScale = maxNorm(denominator);
  if (denominatorScale == 0.0) {
    return false;
  }

  vec2 normalizedDenominator = denominator / denominatorScale;
  float denominatorSquared = dot(
    normalizedDenominator,
    normalizedDenominator
  );
  quotient =
    complexDivide(
      numerator,
      normalizedDenominator,
      denominatorSquared
    ) /
    denominatorScale;
  return !any(isnan(quotient)) && !any(isinf(quotient));
}

bool divideFastOrStable(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorSquared = dot(denominator, denominator);
  if (
    denominatorSquared >= 1e-20 &&
    denominatorSquared <= 1e20
  ) {
    quotient = complexDivide(
      numerator,
      denominator,
      denominatorSquared
    );
    return !any(isnan(quotient)) && !any(isinf(quotient));
  }
  return stableComplexDivide(numerator, denominator, quotient);
}

bool calculateNewtonCorrection(
  vec2 value,
  out vec2 correction
) {
  vec2 reciprocal;
  if (!divideFastOrStable(vec2(1.0, 0.0), value, reciprocal)) {
    return false;
  }

  vec2 reciprocalSquared = complexSquare(reciprocal);
  correction = (value - reciprocalSquared) / 3.0;
  return !any(isnan(correction)) && !any(isinf(correction));
}

bool divideFastOrStableInPlace(
  inout vec2 value,
  vec2 denominator
) {
  vec2 quotient;
  if (!divideFastOrStable(value, denominator, quotient)) {
    return false;
  }
  value = quotient;
  return true;
}

bool divideExtendedBy(
  inout vec2 mantissa,
  inout float exponent,
  vec2 denominator
) {
  float denominatorScale = maxNorm(denominator);
  if (denominatorScale == 0.0) {
    return false;
  }
  if (maxNorm(mantissa) == 0.0) {
    return true;
  }

  float denominatorExponent = floor(log2(denominatorScale));
  float denominatorMantissaScale =
    denominatorScale * exp2(-denominatorExponent);
  vec2 normalizedDenominator =
    (denominator / denominatorScale) * denominatorMantissaScale;
  float denominatorSquared = dot(
    normalizedDenominator,
    normalizedDenominator
  );
  mantissa = complexDivide(
    mantissa,
    normalizedDenominator,
    denominatorSquared
  );
  exponent -= denominatorExponent;
  normalizeExtendedDelta(mantissa, exponent);
  return !any(isnan(mantissa)) && !any(isinf(mantissa));
}

void addExtendedValues(
  vec2 leftMantissa,
  float leftExponent,
  vec2 rightMantissa,
  float rightExponent,
  out vec2 resultMantissa,
  out float resultExponent
) {
  resultExponent = max(leftExponent, rightExponent);
  float leftShift = leftExponent - resultExponent;
  float rightShift = rightExponent - resultExponent;
  vec2 alignedLeft =
    leftShift < -120.0
      ? vec2(0.0)
      : leftMantissa * exp2(leftShift);
  vec2 alignedRight =
    rightShift < -120.0
      ? vec2(0.0)
      : rightMantissa * exp2(rightShift);
  resultMantissa = alignedLeft + alignedRight;
  normalizeExtendedDelta(resultMantissa, resultExponent);
}

bool divideExtendedByExtended(
  inout vec2 mantissa,
  inout float exponent,
  vec2 denominatorMantissa,
  float denominatorExponent
) {
  if (!divideExtendedBy(mantissa, exponent, denominatorMantissa)) {
    return false;
  }
  exponent -= denominatorExponent;
  normalizeExtendedDelta(mantissa, exponent);
  return !any(isnan(mantissa)) && !any(isinf(mantissa));
}

bool iterateExtendedNewton(
  vec2 currentMantissa,
  float currentExponent,
  out vec2 nextMantissa,
  out float nextExponent
) {
  if (maxNorm(currentMantissa) == 0.0) {
    return false;
  }

  vec2 linearMantissa = currentMantissa * (2.0 / 3.0);
  float linearExponent = currentExponent;
  normalizeExtendedDelta(linearMantissa, linearExponent);
  if (currentExponent > 10.0) {
    nextMantissa = linearMantissa;
    nextExponent = linearExponent;
    return true;
  }

  vec2 reciprocalMantissa = vec2(1.0 / 3.0, 0.0);
  float reciprocalExponent = 0.0;
  if (
    !divideExtendedByExtended(
      reciprocalMantissa,
      reciprocalExponent,
      currentMantissa,
      currentExponent
    ) ||
    !divideExtendedByExtended(
      reciprocalMantissa,
      reciprocalExponent,
      currentMantissa,
      currentExponent
    )
  ) {
    return false;
  }
  if (currentExponent < -20.0) {
    nextMantissa = reciprocalMantissa;
    nextExponent = reciprocalExponent;
    return true;
  }

  addExtendedValues(
    linearMantissa,
    linearExponent,
    reciprocalMantissa,
    reciprocalExponent,
    nextMantissa,
    nextExponent
  );
  return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
}

bool calculateNextNewtonDelta(
  vec4 packedReference,
  vec2 delta,
  vec2 deltaMantissa,
  float deltaExponent,
  out vec2 nextMantissa,
  out float nextExponent
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  float referenceScale = maxNorm(reference);
  float actualScale = maxNorm(actual);
  if (referenceScale == 0.0 || actualScale == 0.0) {
    return false;
  }

  if (
    min(referenceScale, actualScale) >= 1e-3 &&
    max(referenceScale, actualScale) <= 1e3
  ) {
    vec2 denominator = complexMultiply(
      complexSquare(reference),
      complexSquare(actual)
    );
    float denominatorSquared = dot(denominator, denominator);
    vec2 reciprocalTerm = complexDivide(
      2.0 * reference + delta,
      denominator,
      denominatorSquared
    );
    vec2 factor = (vec2(2.0, 0.0) - reciprocalTerm) / 3.0;
    nextMantissa = complexMultiply(deltaMantissa, factor);
    nextExponent = deltaExponent;
    normalizeExtendedDelta(nextMantissa, nextExponent);
    return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
  }

  // Δ' = 2Δ/3 - Δ(2Z+Δ)/(3 Z²(Z+Δ)²). Keep both terms in
  // mantissa/exponent form: near the pole the quotient can be larger than
  // float while the represented orbit remains valid.
  vec2 linearMantissa = deltaMantissa * (2.0 / 3.0);
  float linearExponent = deltaExponent;
  normalizeExtendedDelta(linearMantissa, linearExponent);

  vec2 reciprocalMantissa = complexMultiply(
    deltaMantissa,
    2.0 * reference + delta
  );
  float reciprocalExponent = deltaExponent;
  normalizeExtendedDelta(reciprocalMantissa, reciprocalExponent);
  if (
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, reference) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, reference) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, actual) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, actual)
  ) {
    return false;
  }
  reciprocalMantissa *= -1.0 / 3.0;
  normalizeExtendedDelta(reciprocalMantissa, reciprocalExponent);

  addExtendedValues(
    linearMantissa,
    linearExponent,
    reciprocalMantissa,
    reciprocalExponent,
    nextMantissa,
    nextExponent
  );
  return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
}

bool calculateReciprocalPerturbationTerm(
  vec4 packedReference,
  vec2 delta,
  out vec2 reciprocalTerm
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  vec2 numerator = 2.0 * reference + delta;
  float referenceScale = maxNorm(reference);
  float actualScale = maxNorm(actual);

  if (
    min(referenceScale, actualScale) >= 1e-3 &&
    max(referenceScale, actualScale) <= 1e3
  ) {
    vec2 denominator = complexMultiply(
      complexSquare(reference),
      complexSquare(actual)
    );
    float denominatorSquared = dot(denominator, denominator);
    reciprocalTerm = complexDivide(
      numerator,
      denominator,
      denominatorSquared
    );
    return !any(isnan(reciprocalTerm)) && !any(isinf(reciprocalTerm));
  }

  reciprocalTerm = numerator;
  if (
    !divideFastOrStableInPlace(reciprocalTerm, reference) ||
    !divideFastOrStableInPlace(reciprocalTerm, reference) ||
    !divideFastOrStableInPlace(reciprocalTerm, actual) ||
    !divideFastOrStableInPlace(reciprocalTerm, actual)
  ) {
    return false;
  }
  return true;
}

bool calculateCorrectionDelta(
  vec4 packedReference,
  vec2 delta,
  out vec2 correctionDelta
) {
  vec2 reciprocalTerm;
  if (!calculateReciprocalPerturbationTerm(packedReference, delta, reciprocalTerm)) {
    return false;
  }
  correctionDelta = complexMultiply(
    delta,
    (vec2(1.0, 0.0) + reciprocalTerm) / 3.0
  );
  return !any(isnan(correctionDelta)) && !any(isinf(correctionDelta));
}

int nearestRoot(vec2 value) {
  const vec2 ROOT_0 = vec2(1.0, 0.0);
  const vec2 ROOT_1 = vec2(-0.5, 0.866025403784);
  const vec2 ROOT_2 = vec2(-0.5, -0.866025403784);
  float distance0 = dot(value - ROOT_0, value - ROOT_0);
  float distance1 = dot(value - ROOT_1, value - ROOT_1);
  float distance2 = dot(value - ROOT_2, value - ROOT_2);
  if (distance0 <= distance1 && distance0 <= distance2) return 0;
  if (distance1 <= distance2) return 1;
  return 2;
}

vec2 cubicRoot(int index) {
  if (index == 0) return vec2(1.0, 0.0);
  if (index == 1) return vec2(-0.5, 0.866025403784);
  return vec2(-0.5, -0.866025403784);
}

float stableComplexMagnitude(vec2 value) {
  float scale = max(abs(value.x), abs(value.y));
  if (scale == 0.0) {
    return 0.0;
  }
  return scale * length(value / scale);
}

vec2 iterateNewtonLocalError(vec2 error, vec2 root) {
  vec2 errorSquared = complexSquare(error);
  vec2 numerator = complexMultiply(errorSquared, 3.0 * root + 2.0 * error);
  vec2 denominator = 3.0 * complexSquare(root + error);
  float denominatorSquared = dot(denominator, denominator);
  if (denominatorSquared < 1e-20) {
    return vec2(0.0);
  }
  return complexDivide(numerator, denominator, denominatorSquared);
}

float thresholdCrossingPhase(
  float previousMetric,
  float currentMetric,
  float threshold
) {
  vec3 metrics = vec3(previousMetric, currentMetric, threshold);
  if (
    any(isnan(metrics)) ||
    any(isinf(metrics)) ||
    any(lessThanEqual(metrics, vec3(0.0)))
  ) {
    return 1.0;
  }

  float previousLog = log(previousMetric);
  float currentLog = log(currentMetric);
  float denominator = currentLog - previousLog;
  if (abs(denominator) < 1e-6) {
    return 1.0;
  }

  return clamp((log(threshold) - previousLog) / denominator, 0.0, 1.0);
}

float quadraticConvergencePhase(
  float currentMetric,
  float threshold,
  int refinementSteps
) {
  if (currentMetric == 0.0) {
    return 0.0;
  }
  if (
    isnan(currentMetric) ||
    isinf(currentMetric) ||
    isnan(threshold) ||
    isinf(threshold) ||
    currentMetric < 0.0 ||
    currentMetric >= 1.0 ||
    threshold <= 0.0 ||
    threshold >= 1.0
  ) {
    return 1.0;
  }

  float metricLog = -log(currentMetric);
  float thresholdLog = -log(threshold);
  float phase =
    1.0 +
    float(max(refinementSteps, 0)) -
    log(metricLog / thresholdLog) / log(2.0);
  return clamp(phase, 0.0, 1.0);
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(t, vec3(0.50), vec3(0.50), vec3(1.0), vec3(0.00, 0.10, 0.20));
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 planeDelta = u_centerDelta + pixel * (u_scale / u_resolution.y);

${iterationCode(backend)}

  if (resultKind == 0) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
${smoothingCode(backend)}
  }

  float normalizedIteration =
    clamp(colorIteration / max(float(u_maxIterations), 1.0), 0.0, 1.0);
  float rootPosition = float(rootIndex) / 3.0;
  float colorPosition;
  if (resultKind == 2) {
    colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  } else {
    colorPosition =
      rootPosition +
      colorIteration * u_colorDensity * 0.18 +
      u_colorOffset;
  }

  float shade = 0.58 + 0.42 * (1.0 - normalizedIteration);
  vec3 color = max(palette(colorPosition), vec3(0.0)) * shade;
  if (resultKind == 2) {
    color *= vec3(0.64, 0.78, 1.0);
  }
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
}
