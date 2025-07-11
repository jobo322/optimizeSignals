import { getShape1D, Shape1D } from 'ml-peak-shape-generator';
import { Signal, SignalWithShape } from './types';

export function addShape(
  signalInput: Signal<Shape1D>,
  shape: Shape1D = { kind: 'gaussian' },
): SignalWithShape<Shape1D> {
  const signal = structuredClone(signalInput);
  if (!signal.shape) {
    signal.shape = shape;
  } else {
    signal.shape = { ...shape, ...signal.shape };
  }

  return {
    ...signal,
    shape: { ...shape, ...signal.shape },
    constants: [],
  };
}
