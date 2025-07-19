import { getShape1D, Shape1D } from 'ml-peak-shape-generator';
import { DefaultParameters } from './utils/DefaultParameters.js';
import {
  GetInternalSignalsOptions,
  InternalSignal,
  MinMaxRange,
  ParameterNames,
  Properties,
  PropertiesValues,
  SignalWithShape,
} from './types';

const properties: Properties[] = ['init', 'min', 'max', 'gradientDifference'];

export function getInternalSignals<T extends Shape1D = Shape1D>(
  signals: SignalWithShape<T>[],
  minMaxRangeY: MinMaxRange,
  options: GetInternalSignalsOptions<T> = {},
) {
  let index = 0;
  let internalPeaks: InternalSignal<T>[] = [];
  for (const signal of signals) {
    const { pattern = [{ x: 0, y: 1 }], constants = [] } = signal;
    const shape = signal.shape;
    const shapeFct = getShape1D(shape);

    const shapeParameters = ['x', 'y', ...shapeFct.getParameters()];

    if (
      constants.length &&
      !constants.every((c) => shapeParameters.includes(c as string))
    ) {
      throw Error(
        `Some defined constant is not a parameter of the shape: ${shape.kind}`,
      );
    }

    const parameters = shapeParameters.filter(
      //@ts-expect-error shapeParameter is internal, the input type is ensured
      (p) => constants.indexOf(p) < 0,
    );
    const propertiesValues: PropertiesValues = {
      min: [],
      max: [],
      init: [],
      gradientDifference: [],
    };

    for (const parameter of parameters) {
      for (let property of properties) {
        // check if the property is specified in the peak
        let propertyValue = getParameterByKey<T>(parameter, property, signal);

        if (propertyValue) {
          propertyValue = getNormalizedValue(
            propertyValue,
            parameter,
            property,
            minMaxRangeY,
          );

          propertiesValues[property].push(propertyValue);
          continue;
        }
        // check if there are some global option, it could be a number or a callback

        let generalParameterValue = getParameterByKey(
          parameter,
          property,
          options,
        );

        if (generalParameterValue) {
          if (typeof generalParameterValue === 'number') {
            generalParameterValue = getNormalizedValue(
              generalParameterValue,
              parameter,
              property,
              minMaxRangeY,
            );
            propertiesValues[property].push(generalParameterValue);
            continue;
          } else {
            let value = generalParameterValue(signal);
            value = getNormalizedValue(
              value,
              parameter,
              property,
              minMaxRangeY,
            );
            propertiesValues[property].push(value);
            continue;
          }
        }
        //@ts-expect-error TODO: handle or add type to DefaultParameters
        const defaultParameterValues = DefaultParameters[parameter][property];

        propertiesValues[property].push(
          defaultParameterValues(signal, shapeFct),
        );
        if (parameter === 'x') console.log(propertiesValues[property]);
      }
    }

    const fromIndex = index;
    const xIndex = parameters.indexOf('x');
    const yIndex = parameters.indexOf('y');
    const toIndex = fromIndex + parameters.length - 1;
    index += toIndex - fromIndex + 1;
    internalPeaks.push({
      x: signal.x,
      y: (signal.y - minMaxRangeY.min) / minMaxRangeY.range, // normalize y to ensure a good result when y would keep constant
      shape,
      pattern,
      shapeFct,
      parameterNames: parameters as ParameterNames<T>,
      constants,
      xIndex,
      yIndex,
      propertiesValues,
      fromIndex,
    });
  }
  return internalPeaks;
}

function getNormalizedValue(
  value: number,
  parameter: string,
  property: string,
  minMaxY: { min: number; max: number; range: number },
): number {
  if (parameter === 'y') {
    if (property === 'gradientDifference') {
      return value / minMaxY.range;
    } else {
      return (value - minMaxY.min) / minMaxY.range;
    }
  }
  return value;
}

function getParameterByKey<S extends Shape1D>(
  parameterKey: string,
  property: string,
  options: GetInternalSignalsOptions<S>,
): any {
  // @ts-expect-error TODO: handle the types correctly
  return options.parameters?.[parameterKey]?.[property];
}
