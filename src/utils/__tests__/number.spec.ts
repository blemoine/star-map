import * as fc from 'fast-check';
import { fastAtan2 } from '../number';

describe('fastAtan2', () => {
  it('should give a result equal to atan2m rounded at 3', () => {
    fc.assert(
      fc.property(fc.float(),fc.float(), function(a: number, b: number) {
        expect(fastAtan2(a, b)).toBeCloseTo(Math.atan2(a, b), 2);
      })
    );
  });
});
