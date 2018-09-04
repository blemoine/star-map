import * as fc from 'fast-check';
import { Degree, euler2quat, quat2euler } from '../euler-angle';
import { arbitray } from '../../tests/utils/arbitraries';

describe('quaternion and euler angle', () => {
  it('should be the inverse of each other', () => {
    fc.assert(
      fc.property(arbitray.degree, arbitray.degree, arbitray.degree, function(a: Degree, b: Degree, c: Degree) {
        const degrees: [Degree, Degree, Degree] = [a, b, c];

        const result = quat2euler(euler2quat(degrees));
        expect(result.length).toBe(3);
        expect(result[0]).toBeCloseTo(degrees[0], 5);
        expect(result[1]).toBeCloseTo(degrees[1], 5);
        expect(result[2]).toBeCloseTo(degrees[2], 5);
      })
    );
  });
});
