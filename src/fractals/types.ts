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

interface FractalFormulaBase {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly initialView: FractalView;
  readonly preview: FractalPreview;
  readonly suggestedIterations: number;
  readonly iterationControl?: IterationControl;
  readonly parameters: readonly FractalParameter[];
}

export interface EscapeTimeFormula extends FractalFormulaBase {
  readonly renderer: "escape-time";
  readonly escapePower: number;
  readonly deepZoom?: {
    readonly backend: "mandelbrot-perturbation";
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
  readonly basinBackend: "newton-cubic" | "nova-cubic";
}

export interface PointAttractorFormula extends FractalFormulaBase {
  readonly renderer: "point-attractor";
  readonly attractorBackend: "clifford";
}

export type FractalFormula = EscapeTimeFormula | RootBasinFormula | PointAttractorFormula;
