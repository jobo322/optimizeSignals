import { Shape1D } from 'ml-peak-shape-generator';

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
  min: number;
  max: number;
  gradientDifference: number;
}

type ConstantsObject<T extends { kind: string }> =
  | {
      [K in T['kind']]: keyof Omit<Extract<T, { kind: K }>, 'kind'>;
    };

export type ParametersObject<T extends { kind: string }> = {
  [K in T['kind']]: Record<
    keyof Omit<Extract<T, { kind: K }>, 'kind'>,
    ParametersLimits
  >;
} & Record<'x' | 'y', ParametersLimits>;

type Parameters<T extends { kind: string }> = keyof ParametersObject<T>;
type SignalParameters<T extends { kind: string }> = Partial<
  Record<Parameters<T>, ParametersLimits>
>;

export type ParameterNames<T extends { kind: string }> = Array<
  ConstantsObject<T>[T['kind']] | 'x' | 'y'
>;

export type Signal<T extends Shape1D> = {
  x: number;
  y: number;
  shape?: T;
  pattern?: SignalPattern[];
  constants?: Array<ConstantsObject<Shape1D>[T['kind']] | 'x' | 'y'>;
};

export type SignalWithShape<T extends Shape1D> = {
  x: number;
  y: number;
  shape: T;
  pattern?: SignalPattern[];
  constants: Array<ConstantsObject<Shape1D>[T['kind']] | 'x' | 'y'>;
};

export type InternalSignal<T extends Shape1D> = {
  x: number;
  y: number;
  toIndex: number;
  fromIndex: number;
  shape: T;
  pattern: SignalPattern[];
  parameterNames: ParameterNames<T>;
  constants: Array<ConstantsObject<T>[T['kind']] | 'x' | 'y'>;
  propertiesValues: SignalParameters<T>;
};

export type GetInternalSignalsOptions<T extends Shape1D> = {
  parameters?: SignalParameters<T>;
};
