import { MAX_GEOMETRIC_SHADER_DEPTH, MAX_GRID_CELLS } from "../geometric-ifs/rules.ts";

export const GEOMETRIC_IFS_FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_ruleType;
uniform vec2 u_baseSize;
uniform vec2 u_triangleA;
uniform vec2 u_triangleB;
uniform vec2 u_triangleC;
uniform ivec2 u_gridSize;
uniform int u_gridMask[${MAX_GRID_CELLS}];
uniform float u_contractionRatio;
uniform int u_recursionDepth;
uniform bool u_autoDepth;
uniform int u_palette;
uniform int u_colorMode;
uniform float u_colorOffset;

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

vec3 triangleCoordinates(vec2 point) {
  float denominator =
    (u_triangleB.y - u_triangleC.y) * (u_triangleA.x - u_triangleC.x) +
    (u_triangleC.x - u_triangleB.x) * (u_triangleA.y - u_triangleC.y);
  float first = (
    (u_triangleB.y - u_triangleC.y) * (point.x - u_triangleC.x) +
    (u_triangleC.x - u_triangleB.x) * (point.y - u_triangleC.y)
  ) / denominator;
  float second = (
    (u_triangleC.y - u_triangleA.y) * (point.x - u_triangleC.x) +
    (u_triangleA.x - u_triangleC.x) * (point.y - u_triangleC.y)
  ) / denominator;
  return vec3(first, second, 1.0 - first - second);
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);
  vec2 localPoint = point / u_baseSize + 0.5;
  vec3 trianglePoint = triangleCoordinates(point);
  float edgeDistance;
  bool inside;

  if (u_ruleType == 0) {
    vec2 rectangleEdge = 0.5 * u_baseSize - abs(point);
    edgeDistance = min(rectangleEdge.x, rectangleEdge.y);
    inside = all(greaterThanEqual(localPoint, vec2(0.0))) &&
      all(lessThanEqual(localPoint, vec2(1.0)));
  } else {
    edgeDistance = min(trianglePoint.x, min(trianglePoint.y, trianglePoint.z));
    inside = all(greaterThanEqual(trianglePoint, vec3(0.0))) &&
      all(lessThanEqual(trianglePoint, vec3(1.0)));
  }

  vec3 background = vec3(0.006, 0.008, 0.014);
  if (!inside) {
    outColor = vec4(background, 1.0);
    return;
  }

  float baseExtent = max(u_baseSize.x, u_baseSize.y);
  float childPixels = baseExtent * u_resolution.y / u_scale;
  float address = 0.0;
  float terminalLevel = 0.0;
  float holeStrength = 0.0;
  bool removed = false;

  for (int level = 0; level < ${MAX_GEOMETRIC_SHADER_DEPTH}; level++) {
    if (level >= u_recursionDepth) {
      break;
    }

    childPixels *= u_contractionRatio;
    terminalLevel = float(level + 1);

    if (u_ruleType == 0) {
      vec2 scaled = localPoint * vec2(u_gridSize);
      vec2 indexed = min(scaled, vec2(u_gridSize) - vec2(0.000001));
      ivec2 cell = ivec2(floor(indexed));
      int cellIndex = cell.y * u_gridSize.x + cell.x;
      if (u_gridMask[cellIndex] == 0) {
        removed = true;
      }
      address = fract(address * 0.37 + float(cellIndex + 1) * 0.119);
      localPoint = scaled - vec2(cell);
    } else {
      int corner = -1;
      if (trianglePoint.x >= 0.5) {
        corner = 0;
      } else if (trianglePoint.y >= 0.5) {
        corner = 1;
      } else if (trianglePoint.z >= 0.5) {
        corner = 2;
      }
      if (corner < 0) {
        removed = true;
      } else {
        trianglePoint *= 2.0;
        if (corner == 0) {
          trianglePoint.x -= 1.0;
        } else if (corner == 1) {
          trianglePoint.y -= 1.0;
        } else {
          trianglePoint.z -= 1.0;
        }
        address = fract(address * 0.43 + float(corner + 1) * 0.217);
      }
    }

    if (removed) {
      holeStrength = u_autoDepth ? smoothstep(0.68, 1.35, childPixels) : 1.0;
      break;
    }
  }

  float colorPosition = u_colorOffset;
  if (u_colorMode == 1) {
    colorPosition += terminalLevel * 0.113 + address * 0.72;
  } else if (u_colorMode == 2) {
    colorPosition += dot(point, vec2(0.19, 0.27)) + address * 0.48;
  }
  vec3 figure = max(palette(colorPosition), vec3(0.0));
  vec3 color = removed ? mix(figure, background, holeStrength) : figure;

  float edgeWidth = max(fwidth(edgeDistance), 0.000001);
  float outerCoverage = smoothstep(-edgeWidth, edgeWidth, edgeDistance);
  color = mix(background, color, outerCoverage);
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;
