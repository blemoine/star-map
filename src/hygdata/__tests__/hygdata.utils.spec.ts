import { toApparentMagnitude } from '../hygdata.utils';
import { mkParsec } from '../../measures/parsec';
import * as fc from 'fast-check';
import { getOrThrow } from '../../tests/utils/utils';

describe('toApparentMagnitude', () => {
  it('should work as identity function if distance is 10 parsec', () => {
    const dist = getOrThrow(mkParsec(10));
    fc.assert(
      fc.property(fc.float(), function(absMag: number) {
        return Math.abs(toApparentMagnitude(dist, absMag) - absMag) === 0;
      })
    );
  });
  it('should convert correctly absolute magnitude to apparent magnitude at the specified distance', () => {
    const dist = getOrThrow(mkParsec(10.9999));
    const absMag = 1.933;
    expect(toApparentMagnitude(dist, absMag)).toBeCloseTo(2.14, 3);

    const dist2 = getOrThrow(mkParsec(432.9004));
    const absMag2 = -6.932;
    expect(toApparentMagnitude(dist2, absMag2)).toBeCloseTo(1.25, 3);
  });
});
