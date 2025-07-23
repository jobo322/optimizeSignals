import { describe, it, expect } from 'vitest';
import { addShape } from '../addShape';
import { Shape1D } from 'ml-peak-shape-generator';

describe.skip('addShape', () => {
  it('should add shape to signal when shape is not present', () => {
    const shape: Shape1D = { kind: 'gaussian', fwhm: 5 };
    const signal = { x: 1, y: 2 };
    const result = addShape(shape, [], signal);
    expect(result.shape).toEqual(shape);
    expect(result.constants).toEqual([]);
  });

  // it('should merge shape properties when signal already has shape', () => {
  //   const shape: Shape1D = { kind: 'gaussian', fwhm: 5 };
  //   const signal = { x: 1, y: 2, shape: { kind: 'lorentzian', fwhm: 3 } };
  //   const result = addShape(shape, [], signal);
  //   expect(result.shape).toEqual({ kind: 'lorentzian', fwhm: 3 });
  //   expect(result.constants).toEqual([]);
  // });

  it('should return a curried function when signal is not provided', () => {
    const shape: Shape1D = { kind: 'gaussian', fwhm: 5 };
    const signal = { x: 1, y: 2 };
    const shaper = addShape(shape, []);
    const result = shaper(signal);
    expect(result.shape).toEqual(shape);
    expect(result.constants).toEqual([]);
  });
});
