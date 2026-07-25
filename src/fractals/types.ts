export type ComplexValue = readonly [real: number, imaginary: number];

export interface FractalView {
  readonly center: ComplexValue;
  readonly scale: number;
}

interface ParameterBase {
  readonly key: string;
  readonly label: string;
  readonly uniform: string;
  readonly step: number;
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

export interface FractalFormula {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly initialView: FractalView;
  readonly suggestedIterations: number;
  readonly escapePower: number;
  readonly parameters: readonly FractalParameter[];
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
