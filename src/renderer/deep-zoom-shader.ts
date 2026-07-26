import type { DeepZoomBackendId } from "../fractals/types.ts";
import { ESCAPE_SMOOTHING_ITERATIONS } from "../fractals/coloring.ts";

const MAX_ITERATIONS = 2_048;
const MAX_SHADER_ITERATIONS = MAX_ITERATIONS + ESCAPE_SMOOTHING_ITERATIONS;

interface DeepZoomShaderBackend {
  readonly texelsPerIteration: 1 | 2;
  readonly uniforms: string;
  readonly parameterGuard: string;
  readonly initialize: string;
  readonly iterate: string;
  readonly rebase: string;
}

const DEEP_ZOOM_SHADER_BACKENDS = {
  "mandelbrot-perturbation": {
    texelsPerIteration: 1,
    uniforms: "",
    parameterGuard: "",
    initialize: `
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,
    iterate: `
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,
    rebase: `
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `,
  },
  "julia-perturbation": {
    texelsPerIteration: 1,
    uniforms: "uniform vec2 u_juliaConstant;",
    parameterGuard: `
      if (any(isnan(u_juliaConstant))) {
        discard;
      }
    `,
    initialize: `
      vec2 deltaCurrent = planeDelta;
      vec2 deltaPrevious = vec2(0.0);
    `,
    iterate: `
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent);
      nextDeltaPrevious = deltaCurrent;
    `,
    rebase: `
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `,
  },
  "tricorn-perturbation": {
    texelsPerIteration: 1,
    uniforms: "",
    parameterGuard: "",
    initialize: `
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,
    iterate: `
      vec4 conjugatedReference = vec4(
        referenceCurrent.x,
        -referenceCurrent.y,
        referenceCurrent.z,
        -referenceCurrent.w
      );
      vec2 conjugatedDelta = complexConjugate(deltaCurrent);
      nextDeltaCurrent =
        2.0 * multiplyReference(conjugatedReference, conjugatedDelta) +
        complexSquare(conjugatedDelta) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,
    rebase: `
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `,
  },
  "burning-ship-perturbation": {
    texelsPerIteration: 1,
    uniforms: "",
    parameterGuard: "",
    initialize: `
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,
    iterate: `
      vec4 transformedReference = absoluteReference(referenceCurrent);
      vec2 transformedDelta = absolutePerturbationDelta(
        referenceCurrent,
        deltaCurrent
      );
      nextDeltaCurrent =
        2.0 * multiplyReference(transformedReference, transformedDelta) +
        complexSquare(transformedDelta) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,
    rebase: `
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `,
  },
  "phoenix-perturbation": {
    texelsPerIteration: 2,
    uniforms: `
      uniform vec2 u_phoenixConstant;
      uniform float u_phoenixMemory;
    `,
    parameterGuard: `
      if (any(isnan(u_phoenixConstant)) || isnan(u_phoenixMemory)) {
        discard;
      }
    `,
    initialize: `
      vec2 deltaCurrent = planeDelta;
      vec2 deltaPrevious = vec2(0.0);
    `,
    iterate: `
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent) +
        u_phoenixMemory * deltaPrevious;
      nextDeltaPrevious = deltaCurrent;
    `,
    rebase: `
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
      deltaPrevious = subtractReference(actualPreviousZ, referenceStartPrevious);
    `,
  },
} as const satisfies Record<DeepZoomBackendId, DeepZoomShaderBackend>;

export function deepZoomTexelsPerIteration(backend: DeepZoomBackendId): 1 | 2 {
  return DEEP_ZOOM_SHADER_BACKENDS[backend].texelsPerIteration;
}

export function createDeepZoomFragmentShader(backendId: DeepZoomBackendId): string {
  const backend = DEEP_ZOOM_SHADER_BACKENDS[backendId];
  const referencePrevious =
    backend.texelsPerIteration === 2 ? "fetchReference(referenceIndex, 1)" : "vec4(0.0)";
  const nextReferencePrevious =
    backend.texelsPerIteration === 2 ? "fetchReference(nextReferenceIndex, 1)" : "vec4(0.0)";
  const actualPrevious =
    backend.texelsPerIteration === 2
      ? "addReference(nextReferencePrevious, nextDeltaPrevious)"
      : "actualCurrent";
  const referenceStartPrevious =
    backend.texelsPerIteration === 2 ? "fetchReference(0, 1)" : "vec4(0.0)";

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
${backend.uniforms}

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

vec2 complexConjugate(vec2 value) {
  return vec2(value.x, -value.y);
}

vec4 fetchReference(int index, int component) {
  return texelFetch(
    u_referenceOrbit,
    ivec2(component, index),
    0
  );
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

vec2 multiplyReference(vec4 reference, vec2 value) {
  return
    complexMultiply(reference.xy, value) +
    complexMultiply(reference.zw, value);
}

vec4 absoluteReference(vec4 reference) {
  vec2 value = combineReference(reference);
  vec2 direction = vec2(
    value.x > 0.0 ? 1.0 : (value.x < 0.0 ? -1.0 : 0.0),
    value.y > 0.0 ? 1.0 : (value.y < 0.0 ? -1.0 : 0.0)
  );
  return vec4(reference.xy * direction, reference.zw * direction);
}

float absolutePerturbationDeltaComponent(
  float referenceHigh,
  float referenceLow,
  float delta
) {
  float reference = referenceHigh + referenceLow;
  float actual = referenceHigh + (referenceLow + delta);

  if (reference > 0.0) {
    return actual >= 0.0
      ? delta
      : -2.0 * referenceHigh + (-2.0 * referenceLow - delta);
  }
  if (reference < 0.0) {
    return actual <= 0.0
      ? -delta
      : 2.0 * referenceHigh + (2.0 * referenceLow + delta);
  }
  return abs(delta);
}

vec2 absolutePerturbationDelta(vec4 reference, vec2 delta) {
  return vec2(
    absolutePerturbationDeltaComponent(reference.x, reference.z, delta.x),
    absolutePerturbationDeltaComponent(reference.y, reference.w, delta.y)
  );
}

float maxNorm(vec2 value) {
  return max(abs(value.x), abs(value.y));
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(
      t,
      vec3(0.50),
      vec3(0.50),
      vec3(1.0),
      vec3(0.00, 0.10, 0.20)
    );
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
      vec3(1.0, 1.0, 1.0),
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
  ${backend.parameterGuard}
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 planeDelta = u_centerDelta + pixel * (u_scale / u_resolution.y);
  ${backend.initialize}
  vec2 actualZ = vec2(0.0);
  int referenceIndex = 0;
  int iteration = 0;
  int postEscapeIterations = 0;
  bool didEscape = false;

  for (int i = 0; i < ${MAX_SHADER_ITERATIONS}; i++) {
    if (!didEscape && i >= u_maxIterations) {
      break;
    }

    bool wasEscaped = didEscape;
    vec4 referenceCurrent = fetchReference(referenceIndex, 0);
    vec4 referencePrevious = ${referencePrevious};
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 nextDeltaCurrent = vec2(0.0);
    vec2 nextDeltaPrevious = deltaPrevious;
    ${backend.iterate}

    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex, 0);
    vec4 nextReferencePrevious = ${nextReferencePrevious};
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    vec2 actualPreviousZ = ${actualPrevious};
    deltaCurrent = nextDeltaCurrent;
    deltaPrevious = nextDeltaPrevious;

    if (!didEscape && dot(actualZ, actualZ) > 4.0) {
      iteration = i;
      didEscape = true;
      if (!u_smoothColors || dot(actualZ, actualZ) > 1e24) {
        break;
      }
    }

    bool referenceExhausted = nextReferenceIndex >= u_referenceCount - 1;
    bool closerToCriticalPoint = maxNorm(actualZ) < maxNorm(deltaCurrent);
    if (referenceExhausted || closerToCriticalPoint) {
      vec4 referenceStartCurrent = fetchReference(0, 0);
      vec4 referenceStartPrevious = ${referenceStartPrevious};
      ${backend.rebase}
      referenceIndex = 0;
    } else {
      referenceIndex = nextReferenceIndex;
    }

    if (wasEscaped) {
      postEscapeIterations += 1;
      if (
        postEscapeIterations >= ${ESCAPE_SMOOTHING_ITERATIONS} ||
        dot(actualZ, actualZ) > 1e24
      ) {
        break;
      }
    }
  }

  if (!didEscape) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
    float logMagnitude = 0.5 * log(max(dot(actualZ, actualZ), 1.000001));
    float smoothing = log(max(logMagnitude / log(2.0), 0.000001));
    colorIteration +=
      1.0 +
      float(postEscapeIterations) -
      smoothing / log(2.0);
  }

  float colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
}

export const DEEP_ZOOM_FRAGMENT_SHADER = createDeepZoomFragmentShader("mandelbrot-perturbation");
