import { lonlat2xyz, xyzToLonLat, Latitude, Longitude, GeoCoordinates } from '../coordinates';
import * as fc from 'fast-check';
import { arbitray } from '../../tests/utils/arbitraries';
import { isError } from '../../utils/validated';

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
