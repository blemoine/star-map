import { getOrThrow } from '../../tests/utils/utils';
import { mkLatitude, mkRightAscension, decRaToGeo } from '../coordinates';

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
