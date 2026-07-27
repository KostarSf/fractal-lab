import type { EscapeTimeFormula } from "./types.ts";
import { ESCAPE_SMOOTHING_ITERATIONS } from "./coloring.ts";

const MAX_ITERATIONS = 2048;
const MAX_SHADER_ITERATIONS = MAX_ITERATIONS + ESCAPE_SMOOTHING_ITERATIONS;

export const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function parameterDeclaration(formula: EscapeTimeFormula): string {
  return formula.parameters
    .map((parameter) => {
      const glslType = parameter.type === "complex" ? "vec2" : "float";
      return `uniform ${glslType} ${parameter.uniform};`;
    })
    .join("\n");
}

export function createFragmentShader(formula: EscapeTimeFormula): string {
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

${parameterDeclaration(formula)}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
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
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);

  ${formula.shader.setup}

  int iteration = 0;
  int postEscapeIterations = 0;
  bool didEscape = false;

  for (int i = 0; i < ${MAX_SHADER_ITERATIONS}; i++) {
    if (!didEscape && i >= u_maxIterations) {
      break;
    }

    bool wasEscaped = didEscape;
    ${formula.shader.iterate}

    if (!didEscape && ${formula.shader.escaped}) {
      iteration = i;
      didEscape = true;
      if (!u_smoothColors || dot(z, z) > 1e24) {
        break;
      }
    }

    if (wasEscaped) {
      postEscapeIterations += 1;
      if (
        postEscapeIterations >= ${ESCAPE_SMOOTHING_ITERATIONS} ||
        dot(z, z) > 1e24
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
    float logMagnitude = 0.5 * log(max(dot(z, z), 1.000001));
    float smoothing = log(max(logMagnitude / log(2.0), 0.000001));
    colorIteration +=
      1.0 +
      float(postEscapeIterations) -
      smoothing / log(${formula.escapePower.toFixed(1)});
  }

  float colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));

  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
}
