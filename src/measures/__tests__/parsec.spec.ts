import * as fc from 'fast-check';
import { arbitray } from '../../tests/utils/arbitraries';
import { add, mkParsec, Parsec } from '../parsec';
import { isError } from '../../utils/validated';

describe('mkParsec', () => {
  it('should return an error if the number is negative', () => {
    fc.assert(
      fc.property(fc.float(1, 100000000), function(a: number) {
        expect(isError(mkParsec(-a))).toBe(true);
      })
    );
  });
});

describe('add', () => {
  it('should add 2 parsec as if they were 2 numbers', () => {
    fc.assert(
      fc.property(arbitray.parsec, arbitray.parsec, function(a: Parsec, b: Parsec) {
        expect(add(a, b)).toBe(a + b);
      })
    );
  });
});
