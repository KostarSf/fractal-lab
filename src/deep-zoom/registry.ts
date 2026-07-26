import type { DeepZoomBackendId } from "../fractals/types.ts";

export const DEEP_ZOOM_BACKEND_IDS = [
  "mandelbrot-perturbation",
  "julia-perturbation",
  "tricorn-perturbation",
  "burning-ship-perturbation",
  "phoenix-perturbation",
] as const satisfies readonly DeepZoomBackendId[];

const DEEP_ZOOM_BACKEND_ID_SET = new Set<string>(DEEP_ZOOM_BACKEND_IDS);

export function hasDeepZoomBackend(backend: string | undefined): backend is DeepZoomBackendId {
  return backend !== undefined && DEEP_ZOOM_BACKEND_ID_SET.has(backend);
}
