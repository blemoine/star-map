import { mkParsec, Parsec } from '../measures/parsec';
import {
  Declination,
  decRaToGeo,
  GeoCoordinates,
  geoToDecRa,
  lonlat2xyz,
  RightAscension,
  xyzToLonLat,
} from '../geometry/coordinates';
import { flatMap, map, Validated } from '../utils/validated';
import { Vector3D } from '../geometry/vectors';

export type Star = {
  ra: RightAscension;
  dec: Declination;
  distance: Parsec;
  apparentMagnitude: number;
};

export function toApparentMagnitude(distance: Parsec, absoluteMagnitude: number): number {
  return absoluteMagnitude + 5.0 * Math.log10(distance) - 5.0;
}

export function moveOrigin(
  newOrigin: {
    x: Parsec;
    y: Parsec;
    z: Parsec;
  },
  star: Star
): Validated<Star> {
  const newCoord = flatMap(decRaToGeo([star.dec, star.ra]), (latLon) => {
    const unitXyz = lonlat2xyz(latLon);

    const xyz: Vector3D = [
      unitXyz[0] * star.distance - newOrigin.x,
      unitXyz[1] * star.distance - newOrigin.y,
      unitXyz[2] * star.distance - newOrigin.z,
    ];
    const lonlat: Validated<GeoCoordinates> = xyzToLonLat(xyz);
    return flatMap(flatMap(lonlat, geoToDecRa), ([dec, ra]) => {
      const maybeDistance = mkParsec(Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1] + xyz[2] * xyz[2]));
      return map(maybeDistance, (distance) => ({
        ra,
        dec,
        distance,
      }));
    });
  });

  return map(newCoord, ({ dec, ra, distance }) => {
    // TODO refactor to magnitude convert
    const absMag = star.apparentMagnitude + 5.0 - 5 * Math.log10(star.distance);
    const apparentMagnitude = toApparentMagnitude(distance, absMag);
    return {
      ra,
      dec,
      distance,
      apparentMagnitude,
    };
  });
}
