import { moveOrigin, Star, toApparentMagnitude } from '../hygdata.utils';
import { mkParsec, Parsec } from '../../measures/parsec';
import * as fc from 'fast-check';
import { getOrThrow } from '../../tests/utils/utils';
import { Declination, geoToDecRa, RightAscension, xyzToLonLat } from '../../geometry/coordinates';
import { arbitray } from '../../tests/utils/arbitraries';
import { flatMap, isError } from '../../utils/validated';
import { Vector3D } from '../../geometry/vectors';

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

describe('moveOrigin', () => {
  it('should not do anthing if not moving', () => {
    const origin: Vector3D = [0, 0, 0];

    fc.assert(
      fc.property(fc.float(), arbitray.ra, arbitray.dec, arbitray.parsec, function(
        apparentMagnitude: number,
        ra: RightAscension,
        dec: Declination,
        distance: Parsec
      ) {
        const star: Star = {
          id: '123',
          name: 'test',
          ra,
          dec,
          distance,
          apparentMagnitude,
          color: [255, 255, 255],
          radius: null,
        };

        const result = moveOrigin(origin, star);
        if (isError(result)) {
          return fail(`The result should be a star for inputs ${origin} and ${star}`);
        }

        expect(result.ra).toBeCloseTo(star.ra, 6);
        expect(result.dec).toBeCloseTo(star.dec, 6);
        expect(result.distance).toBeCloseTo(star.distance, 6);
        expect(result.apparentMagnitude).toBeCloseTo(star.apparentMagnitude, 6);
      })
    );
  });

  it('should substract distance if going in the original direction', () => {
    fc.assert(
      fc.property(fc.float().filter((i) => i > 0), arbitray.parsec, function(baseDistance: number, newCoord: number) {
        const starCartesian: Vector3D = [baseDistance, 0, 0];
        const [dec, ra] = getOrThrow(flatMap(xyzToLonLat(starCartesian), geoToDecRa));

        const origin: Vector3D = [newCoord, 0, 0];
        const star: Star = {
          id: '123',
          name: 'test',
          dec,
          ra,
          distance: getOrThrow(mkParsec(Math.abs(baseDistance))),
          apparentMagnitude: 5,
          color: [255, 255, 255],
          radius: null,
        };
        const result = moveOrigin(origin, star);
        if (isError(result)) {
          return fail(`The result should be a star for inputs ${origin} and ${star}`);
        }

        expect(result.dec).toBe(0);
        expect(result.distance).toBeCloseTo(Math.abs(baseDistance - newCoord), 6);
      })
    );
  });
});
