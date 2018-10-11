import * as fc from 'fast-check';
import { Arbitrary } from 'fast-check';
import { Degree, mkDegree } from '../../geometry/euler-angle';
import { Latitude, Longitude, mkLatitude, mkLongitude } from '../../geometry/coordinates';
import { getOrThrow } from './utils';
import { mkParsec, Parsec } from '../../measures/parsec';
import { Star } from '../../hygdata/hygdata.utils';

const degree: Arbitrary<Degree> = fc.float().map(mkDegree);
const longitude: Arbitrary<Longitude> = fc.float(-179.999, 180).map((i) => getOrThrow(mkLongitude(i)));
const latitude: Arbitrary<Latitude> = fc.float(-90, 90).map((i) => getOrThrow(mkLatitude(i)));

const parsec: Arbitrary<Parsec> = fc.float(1, 1000000).map((i) => getOrThrow(mkParsec(i)));

const color: Arbitrary<[number, number, number]> = fc
  .float(0, 255)
  .chain((red) =>
    fc.float(0, 255).chain((green) => fc.float(0, 255).map((blue): [number, number, number] => [red, green, blue]))
  );

const vector3d: Arbitrary<[number, number, number]> = fc
  .float()
  .chain((red) => fc.float().chain((green) => fc.float().map((blue): [number, number, number] => [red, green, blue])));

const orNull = <A>(arb: Arbitrary<A>): Arbitrary<A | null> => fc.oneof(arb, fc.constant(null));

const stars: Arbitrary<Star> = fc.string().chain((id) => {
  return fc.string().chain((name) => {
    return parsec.chain((distance) => {
      return fc.float().chain((apparentMagnitude) => {
        return color.chain((color) => {
          return orNull(parsec).chain((radius) => {
            return fc.string().chain((constellation) => {
              return orNull(fc.string()).chain((bayer) => {
                return orNull(fc.string()).chain((flamsteed) => {
                  return vector3d.map((coordinates) => ({
                    id,
                    name,
                    distance,
                    apparentMagnitude,
                    color,
                    radius,
                    constellation,
                    bayer,
                    flamsteed,
                    coordinates,
                  }));
                });
              });
            });
          });
        });
      });
    });
  });
});

export const arbitray = {
  degree,
  latitude,
  longitude,
  parsec,
  stars,
};
