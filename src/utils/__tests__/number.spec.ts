import * as fc from 'fast-check';
import { fastAsin, fastAtan2, parseToFloat } from '../number';
import { isError } from '../validated';

describe('fastAtan2', () => {
  it('should give a result equal to atan2m rounded at 3', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), function(a: number, b: number) {
        expect(fastAtan2(a, b)).toBeCloseTo(Math.atan2(a, b), 2);
      })
    );
  });
  it('should return the correct value for 0,0', () => {
    expect(fastAtan2(0, 0)).toBe(0);
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

describe('parseToFloat', () => {
  it('should fail if the string is not a number', () => {
    const result = parseToFloat('toto');
    expect(isError(result)).toBe(true);
  });
  it('should return the value if the string is a number', () => {
    fc.assert(
      fc.property(fc.float(), (n) => {
        const result = parseToFloat(n + '');
        expect(result).toBe(n);
      })
    );
  });
});
