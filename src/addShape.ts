import { Shape1D } from 'ml-peak-shape-generator';
import { ParameterNames, Signal, SignalWithShape } from './types';

export function addShape<T extends Shape1D = Shape1D>(
  shape: T,
  constants: ParameterNames<T>,
  signalInput: Signal<T>,
): SignalWithShape<T>;
export function addShape<T extends Shape1D = Shape1D>(
  shape: T,
  constants: ParameterNames<T>,
  signalInput?: undefined,
): (signal: Signal<T>) => SignalWithShape<T>;
export function addShape<T extends Shape1D = Shape1D>(
  shape: T,
  constants: ParameterNames<T>,
  signalInput?: Signal<T>,
): SignalWithShape<T> | ((signal: Signal<T>) => SignalWithShape<T>) {
  const fct: (signal: Signal<T>) => SignalWithShape<T> = (
    signalInput: Signal<T>,
  ) => {
    const signal = structuredClone(signalInput);
    if (!signal.shape) {
      signal.shape = shape;
    } else {
      signal.shape = { ...shape, ...signal.shape };
    }

    return {
      ...signal,
      shape: { ...shape, ...signal.shape },
      constants: Array.from(
        new Set([...constants, ...(signal.constants || [])]),
      ),
    };
  };
  if (signalInput) {
    return fct(signalInput);
  } else {
    return fct;
  }
}
