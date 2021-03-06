import { flatMap, raise, Validated, zip } from '../utils/validated';
import { Vector3D, vectorLength } from './vectors';
import { DegreeTag, mkRadian, toDegree, toRadians } from './euler-angle';
import { fastAsin, fastAtan2 } from '../utils/number';

declare class LatitudeTag {
  private _kind: 'latitude';
}
declare class LongitudeTag {
  private _kind: 'latitude';
}

export type Latitude = number & LatitudeTag & DegreeTag;
export type Longitude = number & LongitudeTag & DegreeTag;

export function mkLatitude(n: number): Validated<Latitude> {
  if (n < -90 || n > 90) {
    return raise(`The latitude ${n} should be between -90 and 90`);
  } else {
    return n as Latitude;
  }
}
export function mkLongitude(n: number): Validated<Longitude> {
  if (n < -180 || n > 180) {
    return raise(`The longitude ${n} should be between -180 and 180`);
  } else {
    return n as Longitude;
  }
}

export type GeoCoordinates = [Longitude, Latitude];

export function lonlat2xyz(coord: GeoCoordinates): Vector3D {
  const lon = toRadians(coord[0]);
  const lat = toRadians(coord[1]);

  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.cos(lat) * Math.sin(lon);
  const z = Math.sin(lat);

  return [x, y, z];
}

export function xyzToLonLat(v: Vector3D): Validated<GeoCoordinates> {
  const [x, y, z] = v;
  const dist = vectorLength(v);
  return flatMap(zip(mkRadian(fastAsin(z / dist)), mkRadian(fastAtan2(y, x))), ([asin, atan]) => {
    const lat = mkLatitude(toDegree(asin));
    const lon = mkLongitude(toDegree(atan));

    return zip(lon, lat);
  });
}
