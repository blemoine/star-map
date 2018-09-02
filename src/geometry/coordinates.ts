import { map, raise, Validated } from '../utils/validated';

declare class LatitudeTag {
  private _kind: 'latitude';
}
declare class LongitudeTag {
  private _kind: 'latitude';
}

type Latitude = number & LatitudeTag;
type Longitude = number & LongitudeTag;

export function mkLatitude(n: number): Validated<Latitude> {
  if (n < -90 || n > 90) {
    return raise(`The latitude ${n} should be between -90 and 90`);
  } else {
    return n as Latitude;
  }
}
export function mkLongitude(n: number): Validated<Longitude> {
  if (n < -180 || n > 180) {
    return raise(`The longitude ${n} should be between -90 and 90`);
  } else {
    return n as Longitude;
  }
}

export type GeoCoordinates = [Longitude, Latitude];

declare class RightAscensionTag {
  private _kind: 'rightAscension';
}
type RightAscension = number & RightAscensionTag;
export function mkRightAscension(n: number): Validated<RightAscension> {
  if (n < 0 || n > 24) {
    return raise(`The right ascension ${n} should be between 0 and 24`);
  } else {
    return n as RightAscension;
  }
}

type Declination = Latitude;

export type RaDecCoordinates = [Declination, RightAscension];

export function decRaToGeo([dec, ra]: RaDecCoordinates): Validated<GeoCoordinates> {
  const normalizedRa = ra > 12 ? ra - 24 : ra;

  return map(mkLongitude(normalizedRa * 15), (lon): GeoCoordinates => [lon, dec]);
}
