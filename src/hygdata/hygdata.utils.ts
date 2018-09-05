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

function magnitudeAt(baseMagnitude: number, baseDistance: Parsec, newDistance: Parsec): number {
  return baseMagnitude + 5 * Math.log10(newDistance / baseDistance);
}

export function toApparentMagnitude(distance: Parsec, absoluteMagnitude: number): number {
  return magnitudeAt(absoluteMagnitude, mkParsec(10), distance);
}

export function moveOrigin(newOrigin: Vector3D, star: Star): Validated<Star> {
  const newCoord = flatMap(decRaToGeo([star.dec, star.ra]), (latLon) => {
    const unitXyz = lonlat2xyz(latLon);

    const xyz: Vector3D = [
      unitXyz[0] * star.distance - newOrigin[0],
      unitXyz[1] * star.distance - newOrigin[1],
      unitXyz[2] * star.distance - newOrigin[2],
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
    const apparentMagnitude = magnitudeAt(star.apparentMagnitude, star.distance, distance);
    return {
      ra,
      dec,
      distance,
      apparentMagnitude,
    };
  });
}
