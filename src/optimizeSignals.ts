import { InternalSignal, MinMaxRange } from './types';
import { Shape1D } from 'ml-peak-shape-generator';
//@ts-expect-error should be a type there
import { levenbergMarquardt } from 'ml-levenberg-marquardt';

interface DataXY {
  x: Float64Array;
  y: Float64Array;
}

const properties = ['init', 'min', 'max', 'gradientDifference'];

const defaultOptimizationOptions: OptimizationOptions = {
  damping: 1.5,
  maxIterations: 100,
  errorTolerance: 1e-8,
};

interface OptimizationOptions {
  damping?: number;
  maxIterations?: number;
  errorTolerance?: number;
}
interface optimizeSignalsOptions {
  optimization?: OptimizationOptions;
  minMaxYRange: MinMaxRange;
}

export function optimizeSignals<T extends Shape1D>(
  data: DataXY,
  internalSignals: InternalSignal<T>[],
  options: optimizeSignalsOptions,
) {
  const { optimization = {}, minMaxYRange } = options;

  const nbParams =
    internalSignals[internalSignals.length - 1].parameterNames.length;
  const minValues = new Float64Array(nbParams);
  const maxValues = new Float64Array(nbParams);
  const initialValues = new Float64Array(nbParams);
  const gradientDifferences = new Float64Array(nbParams);
  let index = 0;
  for (const peak of internalSignals) {
    for (let i = 0; i < peak.parameterNames.length; i++) {
      minValues[index] = peak.propertiesValues.min[i];
      maxValues[index] = peak.propertiesValues.max[i];
      initialValues[index] = peak.propertiesValues.init[i];
      gradientDifferences[index] = peak.propertiesValues.gradientDifference[i];
      index++;
    }
  }
  console.log(minValues, maxValues);
  let normalizedY = new Float64Array(data.y.length);
  for (let i = 0; i < data.y.length; i++) {
    normalizedY[i] = (data.y[i] - minMaxYRange.min) / minMaxYRange.range;
  }

  const sumOfShapes = getSumOfShapes(internalSignals);

  let fitted = levenbergMarquardt({ x: data.x, y: normalizedY }, sumOfShapes, {
    minValues,
    maxValues,
    initialValues,
    gradientDifference: gradientDifferences,
    ...defaultOptimizationOptions,
    ...optimization,
  });

  const fittedValues = fitted.parameterValues;

  const newSignals = [];
  for (const signal of internalSignals) {
    const newSignal = {
      x: 0,
      y: 0,
      shape: signal.shape,
    };
    const xIndex = signal.parameterNames.indexOf('x');
    const yIndex = signal.parameterNames.indexOf('y');
    const toIndex = signal.fromIndex + signal.parameterNames.length;

    newSignal.x =
      xIndex > -1 ? fittedValues[signal.fromIndex + xIndex] : signal.x;
    const intensity =
      yIndex > -1 ? fittedValues[signal.fromIndex + yIndex] : signal.y;
    newSignal.y = intensity * minMaxYRange.range + minMaxYRange.min;
    const initIndex = [xIndex, yIndex].reduce(
      (a, b) => (b > -1 ? a + 1 : a),
      0,
    );
    for (let i = initIndex; i < toIndex; i++) {
      // @ts-expect-error should be fixed once
      newSignal.shape[signal.parameterNames[i]] =
        fittedValues[signal.fromIndex + i];
    }

    newSignals.push(newSignal);
  }

  return newSignals;
}

function getSumOfShapes<T extends Shape1D>(
  internalSignals: InternalSignal<T>[],
) {
  return function sumOfShapes(parameters: number[]) {
    return (currentX: number) => {
      let totalY = 0;
      for (const signal of internalSignals) {
        const { parameterNames, xIndex, yIndex, fromIndex } = signal;

        const toIndex = fromIndex + parameterNames.length - 1;

        const delta = xIndex > -1 ? parameters[fromIndex + xIndex] : signal.x;
        const intensity =
          yIndex > -1 ? parameters[fromIndex + yIndex] : signal.y;
        const initIndex = [xIndex, yIndex].reduce(
          (a, b) => (b > -1 ? a + 1 : a),
          0,
        );

        for (let i = initIndex; i <= toIndex; i++) {
          //@ts-expect-error Not simply to solve the issue
          signal.shapeFct[parameterNames[i]] = parameters[signal.fromIndex + i];
        }
        for (let peak of signal.pattern) {
          const { x, y } = peak;
          totalY += y * intensity * signal.shapeFct.fct(currentX - x - delta);
        }
      }
      return totalY;
    };
  };
}
