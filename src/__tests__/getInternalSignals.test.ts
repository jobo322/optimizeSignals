import { myModule } from '..';
import { test } from 'vitest';
import { getInternalSignals } from '../getInternalSignals';

test('test myModule', () => {
  getInternalSignals(
    [
      {
        x: 0,
        y: 1,
        pattern: [{ x: 0, y: 1 }],
        parameters: {
          x: {
            min: -1,
            max: 1,
            gradientDifference: 0.01,
          },
          ,
        },
      },
    ],
    { min: 0, max: 1, range: 1 },
    {},
  );
});
