import { test } from 'vitest';
import { getInternalSignals } from '../getInternalSignals';
import { addShape } from '../addShape';
import { optimizeROI } from '../optimizeROI';
import { generateSpectrum } from 'spectrum-generator';
import { Signal } from '../types';
import { xMinMaxValues } from 'ml-spectra-processing';

test('test myModule', () => {
  const peaks = [
    { x: -0.1, y: 1, width: 0.05 },
    { x: 0.1, y: 1, width: 0.05 },
    { x: 0, y: 2, width: 0.05 },
  ];
  const spectrum = generateSpectrum(peaks, {
    generator: {
      from: -0.3,
      to: 0.3,
      nbPoints: 1024,
      shape: { kind: 'gaussian' },
    },
  });

  const signals = [
    {
      x: 0.02,
      y: 0.5,
      pattern: [
        { x: -0.1, y: 0.5 },
        { x: 0.1, y: 0.5 },
        { x: 0, y: 1 },
      ],
    },
  ];
  // normalize the patterns in getInternalSignals
  // check the convergence of fwhm.
  const temp = xMinMaxValues(spectrum.y);
  const minMaxYRange = { ...temp, range: temp.max - temp.min };
  const shaper = addShape({ kind: 'gaussian', fwhm: 0.02 }, []);
  const signalWithShape = signals.map(shaper);

  const internalSignals = getInternalSignals(signalWithShape, minMaxYRange, {
    parameters: {
      x: { min: -0.05, max: 0.05, gradientDifference: 0.001 },
    },
  });

  const result = optimizeROI(spectrum, internalSignals, {
    minMaxYRange,
    optimization: { maxIterations: 100 },
  });
  console.log(result);
});
