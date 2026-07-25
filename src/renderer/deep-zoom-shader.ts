const MAX_ITERATIONS = 2_048;

export const DEEP_ZOOM_FRAGMENT_SHADER = `#version 300 es
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
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 deltaC = u_centerDelta + pixel * (u_scale / u_resolution.y);
  vec2 deltaZ = vec2(0.0);
  vec2 actualZ = vec2(0.0);
  int referenceIndex = 0;
  int iteration = 0;
  bool didEscape = false;

  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec4 reference = texelFetch(
      u_referenceOrbit,
      ivec2(referenceIndex, 0),
      0
    );
    vec2 linearTerm =
      2.0 * (
        complexMultiply(reference.xy, deltaZ) +
        complexMultiply(reference.zw, deltaZ)
      );
    deltaZ = linearTerm + complexSquare(deltaZ) + deltaC;

    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReference = texelFetch(
      u_referenceOrbit,
      ivec2(nextReferenceIndex, 0),
      0
    );
    actualZ = nextReference.xy + (nextReference.zw + deltaZ);

    if (dot(actualZ, actualZ) > 4.0) {
      iteration = i;
      didEscape = true;
      break;
    }

    bool referenceExhausted = nextReferenceIndex >= u_referenceCount - 1;
    bool unstable = dot(actualZ, actualZ) < dot(deltaZ, deltaZ);
    if (referenceExhausted || unstable) {
      deltaZ = actualZ;
      referenceIndex = 0;
    } else {
      referenceIndex = nextReferenceIndex;
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
    colorIteration += 1.0 - smoothing / log(2.0);
  }

  float colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
