import type { RootBasinFormula } from "../fractals/types.ts";

const MAX_ITERATIONS = 2_048;

function parameterDeclarations(formula: RootBasinFormula): string {
  return formula.parameters
    .map((parameter) => {
      const glslType = parameter.type === "complex" ? "vec2" : "float";
      return `uniform ${glslType} ${parameter.uniform};`;
    })
    .join("\n");
}

function iterationCode(formula: RootBasinFormula): string {
  if (formula.basinBackend === "newton-cubic") {
    return `
  vec2 z = point;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  float finalMetric = 1.0;

  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec2 zSquared = complexSquare(z);
    vec2 numerator = complexMultiply(zSquared, z) - vec2(1.0, 0.0);
    vec2 derivative = 3.0 * zSquared;
    float denominator = dot(derivative, derivative);
    if (denominator < 1e-20) {
      break;
    }

    vec2 correction = complexDivide(numerator, derivative, denominator);
    z -= correction;
    iteration = i;
    finalMetric = length(correction);

    if (dot(correction, correction) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(z);
      resultKind = 1;
      break;
    }
  }
`;
  }

  return `
  vec2 z = vec2(1.0, 0.0);
  vec2 c = point;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  float finalMetric = 1.0;
  float escapeRadiusSquared = u_novaEscapeRadius * u_novaEscapeRadius;

  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec2 zSquared = complexSquare(z);
    vec2 numerator = complexMultiply(zSquared, z) - vec2(1.0, 0.0);
    vec2 derivative = 3.0 * zSquared;
    float denominator = dot(derivative, derivative);
    if (denominator < 1e-20) {
      break;
    }

    vec2 correction = complexDivide(numerator, derivative, denominator);
    vec2 nextZ = z - u_novaRelaxation * correction + c;
    vec2 delta = nextZ - z;
    z = nextZ;
    iteration = i;
    finalMetric = length(delta);

    if (dot(z, z) > escapeRadiusSquared) {
      resultKind = 2;
      break;
    }
    if (dot(delta, delta) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(z);
      resultKind = 1;
      break;
    }
  }
`;
}

export function createBasinFragmentShader(formula: RootBasinFormula): string {
  return `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;

${parameterDeclarations(formula)}

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
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);

${iterationCode(formula)}

  if (resultKind == 0) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float normalizedIteration = float(iteration) / max(float(u_maxIterations), 1.0);
  float rootPosition = float(rootIndex) / 3.0;
  float colorPosition;
  if (resultKind == 2) {
    colorPosition = float(iteration) * u_colorDensity + u_colorOffset;
  } else {
    colorPosition =
      rootPosition +
      float(iteration) * u_colorDensity * 0.18 +
      u_colorOffset;
  }

  float shade;
  if (u_smoothColors) {
    float convergence =
      clamp(-log(max(finalMetric, 1e-12)) / (12.0 * log(10.0)), 0.0, 1.0);
    shade = mix(0.38, 1.0, 0.55 * (1.0 - normalizedIteration) + 0.45 * convergence);
  } else {
    shade = 0.58 + 0.42 * (1.0 - normalizedIteration);
  }

  vec3 color = max(palette(colorPosition), vec3(0.0)) * shade;
  if (resultKind == 2) {
    color *= vec3(0.64, 0.78, 1.0);
  }
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
}
