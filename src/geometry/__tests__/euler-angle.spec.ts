import * as fc from 'fast-check';
import { Degree, euler2quat, mkDegree, quat2euler } from '../euler-angle';

describe('quaternion and euler angle', () => {
  it('should be the inverse of each other', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), fc.float(), function(a: number, b: number, c: number) {
        const degrees: [Degree, Degree, Degree] = [mkDegree(a), mkDegree(b), mkDegree(c)];

        const result = quat2euler(euler2quat(degrees));
        expect(result.length).toBe(3);
        expect(result[0]).toBeCloseTo(degrees[0], 5);
        expect(result[1]).toBeCloseTo(degrees[1], 5);
        expect(result[2]).toBeCloseTo(degrees[2], 5);
      })
    );
  });
});
