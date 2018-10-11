import { interchangeToStar, moveOrigin, Star, starToInterchange } from '../hygdata.utils';
import { mkParsec } from '../../measures/parsec';
import * as fc from 'fast-check';
import { getOrThrow } from '../../tests/utils/utils';
import { arbitray } from '../../tests/utils/arbitraries';
import { isError } from '../../utils/validated';
import { Vector3D, vectorLength } from '../../geometry/vectors';

describe('moveOrigin', () => {
  it('should not do anthing if not moving', () => {
    const origin: Vector3D = [0, 0, 0];

    fc.assert(
      fc.property(fc.float(), fc.float(), fc.float(), fc.float(), function(
        apparentMagnitude: number,
        x: number,
        y: number,
        z: number
      ) {
        const coordinates: Vector3D = [x, y, z];
        const star: Star = {
          id: '123',
          name: 'test',
          coordinates: coordinates,
          distance: getOrThrow(mkParsec(vectorLength(coordinates))),
          apparentMagnitude,
          color: [255, 255, 255],
          radius: null,
          bayer: null,
          flamsteed: null,
          constellation: 'test',
        };

        const result = moveOrigin(origin, star);
        if (isError(result)) {
          return fail(`The result should be a star for inputs ${origin} and ${star}`);
        }

        expect(result.coordinates).toEqual(star.coordinates);
        expect(result.distance).toBeCloseTo(star.distance, 6);
        expect(result.apparentMagnitude).toBeCloseTo(star.apparentMagnitude, 6);
      })
    );
  });

  it('should substract distance if going in the original direction', () => {
    fc.assert(
      fc.property(fc.float().filter((i) => i > 0), arbitray.parsec, function(baseDistance: number, newCoord: number) {
        const coordinates: Vector3D = [baseDistance, 0, 0];

        const origin: Vector3D = [newCoord, 0, 0];
        const star: Star = {
          id: '123',
          name: 'test',
          distance: getOrThrow(mkParsec(Math.abs(baseDistance))),
          apparentMagnitude: 5,
          color: [255, 255, 255],
          radius: null,
          bayer: null,
          flamsteed: null,
          coordinates: coordinates,
          constellation: 'test',
        };
        const result = moveOrigin(origin, star);
        if (isError(result)) {
          return fail(`The result should be a star for inputs ${origin} and ${star}`);
        }

        expect(result.coordinates[0]).toBe(baseDistance - newCoord);
        expect(result.coordinates[1]).toBe(0);
        expect(result.coordinates[2]).toBe(0);
        expect(result.distance).toBeCloseTo(Math.abs(baseDistance - newCoord), 6);
      })
    );
  });
});

describe('star and interchange format', () => {
  it('should be invert of each other', () => {
    fc.assert(fc.property(arbitray.stars, function(star: Star) {
      expect(interchangeToStar(starToInterchange(star))).toEqual(star)
    }));
  });
});
