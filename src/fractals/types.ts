export type ComplexValue = readonly [real: number, imaginary: number];

export interface FractalView {
  readonly center: ComplexValue;
  readonly scale: number;
}

export interface IterationControl {
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

export interface FractalPreview {
  readonly view: FractalView;
  readonly iterations?: number;
  readonly recursionDepth?: number;
  readonly geometricColoring?: GeometricColoring;
  readonly palette?: number;
  readonly colorDensity?: number;
  readonly colorOffset?: number;
  readonly parameters?: Readonly<Record<string, FractalParameterValue>>;
}

interface ParameterBase {
  readonly key: string;
  readonly label: string;
  readonly uniform: string;
  readonly step: number;
  readonly min?: number;
  readonly max?: number;
  readonly affectsOrbit?: boolean;
}

export interface NumberParameter extends ParameterBase {
  readonly type: "number";
  readonly defaultValue: number;
}

export interface ComplexParameter extends ParameterBase {
  readonly type: "complex";
  readonly defaultValue: ComplexValue;
}

export type FractalParameter = NumberParameter | ComplexParameter;
export type FractalParameterValue = number | ComplexValue;

export type DeepZoomBackendId =
  | "mandelbrot-perturbation"
  | "julia-perturbation"
  | "tricorn-perturbation"
  | "burning-ship-perturbation"
  | "phoenix-perturbation";

interface FractalFormulaBase {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly initialView: FractalView;
  readonly preview: FractalPreview;
  readonly iterationControl?: IterationControl;
  readonly parameters: readonly FractalParameter[];
}

export interface EscapeTimeFormula extends FractalFormulaBase {
  readonly renderer: "escape-time";
  readonly suggestedIterations: number;
  readonly escapePower: number;
  readonly deepZoom?: {
    readonly backend: DeepZoomBackendId;
    readonly maxMagnification?: number;
  };
  readonly shader: {
    /**
     * Must declare at least `vec2 z`. `point` contains the complex coordinate
     * represented by the current pixel.
     */
    readonly setup: string;
    /**
     * Advances the orbit by one iteration. Local variables declared in setup
     * remain available here.
     */
    readonly iterate: string;
    /** A GLSL boolean expression evaluated after each iteration. */
    readonly escaped: string;
  };
}

export interface RootBasinFormula extends FractalFormulaBase {
  readonly renderer: "root-basin";
  readonly suggestedIterations: number;
  readonly basinBackend: "newton-cubic" | "nova-cubic";
}

export interface PointAttractorFormula extends FractalFormulaBase {
  readonly renderer: "point-attractor";
  readonly suggestedIterations: number;
  readonly attractorBackend: "clifford";
}

export type GeometricColoring = "solid" | "level" | "gradient";
export type RecursionDepthMode = "auto" | "manual";

export interface AffineTransform {
  /**
   * Row-major linear part of an affine transform in the normalized base area.
   */
  readonly matrix: readonly [a: number, b: number, c: number, d: number];
  readonly translate: ComplexValue;
}

export interface RectangleBaseArea {
  readonly shape: "rectangle";
  readonly size: readonly [width: number, height: number];
}

export interface TriangleBaseArea {
  readonly shape: "triangle";
  readonly vertices: readonly [ComplexValue, ComplexValue, ComplexValue];
}

export interface GridIfsRule {
  readonly backend: "grid";
  readonly baseArea: RectangleBaseArea;
  readonly grid: {
    readonly columns: number;
    readonly rows: number;
    /** Row-major from the lower-left cell. */
    readonly mask: readonly boolean[];
  };
  readonly transforms: readonly AffineTransform[];
  readonly contractionRatio: number;
  readonly recommendedMaxDepth: number;
  readonly defaultDepth: number;
  readonly defaultColoring: GeometricColoring;
}

export interface TriangleIfsRule {
  readonly backend: "triangle-corners";
  readonly baseArea: TriangleBaseArea;
  readonly transforms: readonly AffineTransform[];
  readonly contractionRatio: number;
  readonly recommendedMaxDepth: number;
  readonly defaultDepth: number;
  readonly defaultColoring: GeometricColoring;
}

export type GeometricIfsRule = GridIfsRule | TriangleIfsRule;

export interface GeometricIfsFormula extends FractalFormulaBase {
  readonly renderer: "geometric-ifs";
  readonly geometricIfs: GeometricIfsRule;
}

export type FractalFormula =
  | EscapeTimeFormula
  | RootBasinFormula
  | PointAttractorFormula
  | GeometricIfsFormula;
