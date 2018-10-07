import * as fc from 'fast-check';
import { Arbitrary } from 'fast-check';
import { Degree, mkDegree } from '../../geometry/euler-angle';
import { Latitude, Longitude, mkLatitude, mkLongitude } from '../../geometry/coordinates';
import { getOrThrow } from './utils';
import { mkParsec, Parsec } from '../../measures/parsec';

const degree: Arbitrary<Degree> = fc.float().map(mkDegree);
const longitude: Arbitrary<Longitude> = fc.float(-179.999, 180).map((i) => getOrThrow(mkLongitude(i)));
const latitude: Arbitrary<Latitude> = fc.float(-90, 90).map((i) => getOrThrow(mkLatitude(i)));

const parsec: Arbitrary<Parsec> = fc.float(1, 1000000).map((i) => getOrThrow(mkParsec(i)));

export const arbitray = {
  degree,
  latitude,
  longitude,
  parsec,
};
