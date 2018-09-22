import * as fc from 'fast-check';
import { fastAsin, fastAtan2 } from '../number';

describe('fastAtan2', () => {
  it('should give a result equal to atan2m rounded at 3', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), function(a: number, b: number) {
        expect(fastAtan2(a, b)).toBeCloseTo(Math.atan2(a, b), 2);
      })
    );
  });
});

describe('fastAsin', () => {
  it('should give a result equal to atan2m rounded at 3', () => {
    fc.assert(
      fc.property(fc.float(-Math.PI / 2, Math.PI / 2), function(a: number) {
        const actual = fastAsin(a);
        if (Number.isNaN(actual)) {
          expect(actual).toEqual(Math.asin(a));
        } else {
          expect(actual).toBeCloseTo(Math.asin(a), 2);
        }
      })
    );
  });
});
