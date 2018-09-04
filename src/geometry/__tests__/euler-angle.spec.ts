import * as jsc from 'jsverify';
import { Degree, euler2quat, mkDegree, quat2euler } from '../euler-angle';

describe('quaternion and euler angle', () => {
  it('should be the inverse of each other', () => {
    jsc.assertForall('number', 'number', 'number', function(a: number, b: number, c: number) {
      const degrees: [Degree, Degree, Degree] = [mkDegree(a), mkDegree(b), mkDegree(c)];

      const result = quat2euler(euler2quat(degrees));
      return (
        result.length === 3 &&
        Math.abs(result[0] - degrees[0]) < 0.00001 &&
        Math.abs(result[1] - degrees[1]) < 0.00001 &&
        Math.abs(result[2] - degrees[2]) < 0.00001
      );
    });
  });
});
