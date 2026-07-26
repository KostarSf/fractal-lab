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
  vec2 actualZ = addReference(fetchReference(0), deltaCurrent);
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

    vec4 referenceCurrent = fetchReference(referenceIndex);
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 zSquared = complexSquare(actualCurrent);
    vec2 numerator = complexMultiply(zSquared, actualCurrent) - vec2(1.0, 0.0);
    vec2 derivative = 3.0 * zSquared;
    float derivativeSquared = dot(derivative, derivative);
    if (derivativeSquared < 1e-20) {
      break;
    }

    vec2 correction = complexDivide(numerator, derivative, derivativeSquared);
    vec2 newtonFactor;
    if (!calculateNewtonPerturbationFactor(referenceCurrent, deltaCurrent, newtonFactor)) {
      break;
    }

    vec2 nextDeltaMantissa = complexMultiply(deltaMantissa, newtonFactor);
    float nextDeltaExponent = deltaExponent;
    normalizeExtendedDelta(nextDeltaMantissa, nextDeltaExponent);
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
  vec2 deltaCurrent = vec2(0.0);
  vec2 actualZ = addReference(fetchReference(0), deltaCurrent);
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
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 zSquared = complexSquare(actualCurrent);
    vec2 derivative = 3.0 * zSquared;
    float derivativeSquared = dot(derivative, derivative);
    if (derivativeSquared < 1e-20) {
      break;
    }

    vec2 correctionDelta;
    if (!calculateCorrectionDelta(referenceCurrent, deltaCurrent, correctionDelta)) {
      break;
    }

    vec2 nextDeltaCurrent =
      deltaCurrent -
      u_novaRelaxation * correctionDelta +
      planeDelta;
    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex);
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    vec2 stepDelta = actualZ - actualCurrent;
    iteration = i;
    finalMetric = length(stepDelta);

    if (dot(actualZ, actualZ) > escapeRadiusSquared) {
      previousMetric = length(actualCurrent);
      finalMetric = length(actualZ);
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
    bool closerToCriticalPoint = maxNorm(actualZ) < maxNorm(nextDeltaCurrent);
    if (referenceExhausted || closerToCriticalPoint) {
      deltaCurrent = subtractReference(actualZ, fetchReference(0));
      referenceIndex = 0;
    } else {
      deltaCurrent = nextDeltaCurrent;
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

bool stableComplexDivideInPlace(
  inout vec2 value,
  vec2 denominator
) {
  vec2 quotient;
  if (!stableComplexDivide(value, denominator, quotient)) {
    return false;
  }
  value = quotient;
  return true;
}

bool calculateNewtonPerturbationFactor(
  vec4 packedReference,
  vec2 delta,
  out vec2 factor
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  vec2 reciprocalTerm = 2.0 * reference + delta;

  if (
    !stableComplexDivideInPlace(reciprocalTerm, reference) ||
    !stableComplexDivideInPlace(reciprocalTerm, reference) ||
    !stableComplexDivideInPlace(reciprocalTerm, actual) ||
    !stableComplexDivideInPlace(reciprocalTerm, actual)
  ) {
    return false;
  }

  factor = (vec2(2.0, 0.0) - reciprocalTerm) / 3.0;
  return !any(isnan(factor)) && !any(isinf(factor));
}

bool calculateCorrectionDelta(
  vec4 packedReference,
  vec2 delta,
  out vec2 correctionDelta
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  vec2 reciprocalNumerator = complexMultiply(
    delta,
    2.0 * reference + delta
  );
  vec2 reciprocalDenominator = complexMultiply(
    complexSquare(reference),
    complexSquare(actual)
  );
  float denominatorSquared = dot(reciprocalDenominator, reciprocalDenominator);
  if (denominatorSquared < 1e-38) {
    return false;
  }

  vec2 reciprocalDifference = complexDivide(
    reciprocalNumerator,
    reciprocalDenominator,
    denominatorSquared
  );
  correctionDelta = (delta + reciprocalDifference) / 3.0;
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
