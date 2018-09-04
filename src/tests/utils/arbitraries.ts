import * as fc from 'fast-check';
import { Degree, mkDegree } from '../../geometry/euler-angle';
import { Arbitrary } from 'fast-check';

const degree: Arbitrary<Degree> = fc.float().map(mkDegree);
export const arbitray = {
  degree,
};
