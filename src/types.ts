import { Shape1D, Shape1DInstance } from 'ml-peak-shape-generator';

export interface MinMaxRange {
  min: number;
  max: number;
  range: number;
}

interface SignalPattern {
  x: number;
  y: number;
}

interface ParametersLimits {
  init: number;
  min: number;
  max: number;
  gradientDifference: number;
}

export type Properties = 'init' | 'min' | 'max' | 'gradientDifference';
export type PropertiesValues = Record<Properties, number[]>;

type ConstantsObject<T extends { kind: string }> =
  | {
      [K in T['kind']]: keyof Omit<Extract<T, { kind: K }>, 'kind'>;
    };

export type Parameters<T extends { kind: string }> =
  | 'x'
  | 'y'
  | {
      [K in T['kind']]: keyof Omit<Extract<T, { kind: K }>, 'kind'>;
    }[T['kind']];

export type ParametersObject<T extends { kind: string }> = Record<
  Parameters<T>,
  ParametersLimits
>;

type SignalParameters<T extends { kind: string }> = Partial<
  Record<Parameters<T>, Partial<ParametersLimits>>
>;

export type ParameterName<T extends { kind: string } = Shape1D> =
  | ConstantsObject<T>[T['kind']]
  | 'x'
  | 'y';

export type ParameterNames<T extends { kind: string } = Shape1D> =
  ParameterName<T>[];

export type Signal<T extends Shape1D = Shape1D> = {
  x: number;
  y: number;
  shape?: T;
  pattern?: SignalPattern[];
  parameters?: SignalParameters<T>;
  constants?: ParameterNames<T>;
};

export type SignalWithShape<T extends Shape1D> = {
  x: number;
  y: number;
  shape: T;
  pattern?: SignalPattern[];
  parameters?: SignalParameters<T>;
  constants?: ParameterNames<T>;
};

export type InternalSignal<T extends Shape1D = Shape1D> = {
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  fromIndex: number;
  shape: T;
  shapeFct: Shape1DInstance;
  pattern: SignalPattern[];
  parameterNames: ParameterNames<T>;
  constants: ParameterNames<T>;
  propertiesValues: PropertiesValues;
};

export type GetInternalSignalsOptions<T extends Shape1D = Shape1D> = {
  constants?: ParameterNames<T>;
  parameters?: SignalParameters<T>;
};
