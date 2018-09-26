import { convertToGeoJson } from '../hygdata';
import { isError } from '../../utils/validated';
import { getOrThrow } from '../../tests/utils/utils';
import { mkParsec } from '../../measures/parsec';

describe('convertToGeoJson', () => {
  describe('parsing', () => {
    it('invert longitude coordinate', () => {
      const result = convertToGeoJson({
        2076: {
          apparentMagnitude: 10.4,
          bayer: 'alp',
          flamsteed: '1',
          constellation: 'phe',
          color: [255, 227, 190],
          distance: getOrThrow(mkParsec(25.974)),
          id: '2076',
          name: 'Ankaa',
          coordinates: [19.083654, 2.198282, -17.483284],
          radius: getOrThrow(mkParsec(8.121814873393534e-9)),
        },
      });
      if (isError(result)) {
        throw new Error(`${result} should not be an error`);
      }
      expect(result.features).toEqual([
        {
          geometry: { coordinates: [-6.5710427108462115, -42.305928475316286], type: 'Point' },
          id: '2076',
          properties: {
            apparentMagnitude: 10.4,
            bayer: 'alp',
            flamsteed: '1',
            constellation: 'phe',
            color: [255, 227, 190],
            distance: 25.974,
            id: '2076',
            name: 'Ankaa',
            coordinates: [19.083654, 2.198282, -17.483284],
            radius: 8.121814873393534e-9,
          },
          type: 'Feature',
        },
      ]);
    });
  });
});
