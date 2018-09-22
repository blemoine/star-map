import { getOrThrow } from '../../tests/utils/utils';
import {
  mkLatitude,
  mkRightAscension,
  decRaToGeo,
  lonlat2xyz,
  xyzToLonLat,
  Latitude,
  Longitude,
  GeoCoordinates,
  geoToDecRa,
} from '../coordinates';
import * as fc from 'fast-check';
import { arbitray } from '../../tests/utils/arbitraries';
import { flatMap, isError } from '../../utils/validated';

describe('coordinates', () => {
  it('should convert center to center', () => {
    const ra = getOrThrow(mkRightAscension(0));
    const dec = getOrThrow(mkLatitude(0));

    expect(decRaToGeo([dec, ra])).toEqual([0, 0]);
  });

  it('should convert 12 to 180', () => {
    const ra = getOrThrow(mkRightAscension(12));
    const dec = getOrThrow(mkLatitude(10));

    expect(decRaToGeo([dec, ra])).toEqual([180, 10]);
  });

  it('should convert 23 to -15', () => {
    const ra = getOrThrow(mkRightAscension(23));
    const dec = getOrThrow(mkLatitude(-22));

    expect(decRaToGeo([dec, ra])).toEqual([-15, -22]);
  });

  it('should convert 13 to -165', () => {
    const ra = getOrThrow(mkRightAscension(13));
    const dec = getOrThrow(mkLatitude(-88));

    expect(decRaToGeo([dec, ra])).toEqual([-165, -88]);
  });
});

describe('lonlat2xyz and xyzToLonLat', () => {
  it('should be invert', () => {
    fc.assert(
      fc.property(arbitray.longitude, arbitray.latitude, function(longitude: Longitude, latitude: Latitude) {
        const input: GeoCoordinates = [longitude, latitude];

        const result = xyzToLonLat(lonlat2xyz(input));
        if (isError(result)) {
          return fail(`For input ${input}, to result valid were generated, ` + JSON.stringify(result));
        }
        expect(result.length).toEqual(2);
        expect(result[0]).toBeCloseTo(input[0], 2);
        expect(result[1]).toBeCloseTo(input[1], 2);
      })
    );
  });
});

describe('geoToDecRa and decRaToGeo', () => {
  it('should be invert', () => {
    fc.assert(
      fc.property(arbitray.longitude, arbitray.latitude, function(longitude: Longitude, latitude: Latitude) {
        const input: GeoCoordinates = [longitude, latitude];
        const result = flatMap(geoToDecRa(input), decRaToGeo);
        if (isError(result)) {
          return fail(`For input ${input}, to result valid were generated, ` + result);
        }
        expect(result.length).toEqual(2);
        expect(result[0]).toBeCloseTo(input[0], 5);
        expect(result[1]).toBeCloseTo(input[1], 5);
      })
    );
  });
});
