import { Star } from '../../hygdata/hygdata.utils';
import { mkParsec } from '../../measures/parsec';
import { getOrThrow } from '../../tests/utils/utils';
import { constellationAsStarId, convertStarNameToFullName, validateConstellationJson } from '../constellations.helpers';
import { isError } from '../../utils/validated';

describe('constellationAsStarId', () => {
  const stars: { [key: string]: Star } = {
    '112601': {
      id: '112601',
      name: '',
      bayer: 'lambda',
      flamsteed: '15',
      constellation: 'aqr',
      color: [255, 198, 118],
      distance: getOrThrow(mkParsec(118.0638)),
      apparentMagnitude: 3.73,
      radius: getOrThrow(mkParsec(0.000001223435776852617)),
      coordinates: [112.009754, -33.916636, -15.573012],
    },
    '114670': {
      id: '114670',
      name: '',
      bayer: 'psi-2',
      flamsteed: '23',
      constellation: 'aqr',
      color: [170, 191, 255],
      distance: getOrThrow(mkParsec(123.1527)),
      apparentMagnitude: 4.41,
      radius: getOrThrow(mkParsec(2.863916287468094e-8)),
      coordinates: [119.529341, -22.20547, -19.652688],
    },
  };
  it('should return an error if one star is not found', () => {
    const result = constellationAsStarId(stars, [['AQR', 'lambda'], ['ORI', 'pi-2']]);
    if (isError(result)) {
      expect(result.errors().length).toEqual(1);
    } else {
      fail(`${result} should be an error`);
    }
  });
  it('should return an error if one star is not found even approximately', () => {
    const result = constellationAsStarId(stars, [['AQR', 'lambda'], ['AQR', 'eta']]);
    if (isError(result)) {
      expect(result.errors().length).toEqual(1);
    } else {
      fail(`${result} should be an error`);
    }
  });
  it('should return the constellation ids', () => {
    const result = constellationAsStarId(stars, [['AQR', 'lambda'], ['AQR', 'psi']]);
    if (isError(result)) {
      fail(`${result} should not be an error`);
    } else {
      expect(result).toEqual(['112601', '114670']);
    }
  });
});

describe('convertStarNameToFullName', () => {
  it('should convert simple name to long name', () => {
    expect(convertStarNameToFullName('ALP')).toBe('alpha');
    expect(convertStarNameToFullName('EPS')).toBe('epsilon');
  });
  it('should convert correct short name to correct short name', () => {
    expect(convertStarNameToFullName('PI')).toBe('pi');
    expect(convertStarNameToFullName('MU')).toBe('mu');
  });
  it('should convert composed name to correct composed name', () => {
    expect(convertStarNameToFullName('NU-2')).toBe('nu-2');
    expect(convertStarNameToFullName('DEL-14')).toBe('delta-14');
  });
  it('should lower case unknown name', () => {
    expect(convertStarNameToFullName('TEST')).toBe('test');
  });
});

describe('validateConstellationJson', () => {
  it('should return true for a valid constellation structures', () => {
    expect(
      validateConstellationJson([
        [['ORI', 'zeta'], ['ORI', 'epsilon'], ['ORI', 'delta']],
        [['ARI', 'gamma'], ['ARI', 'beta'], ['ARI', 'alpha'], ['ARI', '41']],
      ])
    ).toBe(true);
  });
  it('should return false if not a valid constellation structure', () => {
    expect(validateConstellationJson(null)).toBe(false);
    expect(validateConstellationJson({})).toBe(false);
    expect(validateConstellationJson([{}])).toBe(false);
    expect(validateConstellationJson([[['ORI', 'zeta'], ['ORI', 'epsilon'], ['ORI', 'delta', 'da']]])).toBe(false);
  });
});
