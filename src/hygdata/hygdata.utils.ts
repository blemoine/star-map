import { mkParsec, Parsec, toKm, toLightYear } from '../measures/parsec';
import { map, Validated } from '../utils/validated';
import { Vector3D, vectorLength } from '../geometry/vectors';
import { toFullName } from '../constellations/constellations';
import { round } from '../utils/number';

export type Star = {
  id: string;
  name: string;
  distance: Parsec;
  apparentMagnitude: number;
  color: [number, number, number];
  radius: Parsec | null;
  constellation: string;
  bayer: string | null;
  flamsteed: string | null;
  coordinates: Vector3D;
};

export function magnitudeAt(baseMagnitude: number, baseDistance: Parsec, newDistance: Parsec): number {
  return baseMagnitude + 5 * Math.log10(newDistance / baseDistance);
}

export function toApparentMagnitude(distance: Parsec, absoluteMagnitude: number): number {
  return magnitudeAt(absoluteMagnitude, mkParsec(10), distance);
}

export function toAbsoluteMagnitude(baseMagnitude: number, baseDistance: Parsec): number {
  return magnitudeAt(baseMagnitude, baseDistance, mkParsec(10));
}

export function moveOrigin(newOrigin: Vector3D, star: Star): Validated<Star> {
  const coordinates: Vector3D = [
    star.coordinates[0] - newOrigin[0],
    star.coordinates[1] - newOrigin[1],
    star.coordinates[2] - newOrigin[2],
  ];
  const maybeDistance = mkParsec(vectorLength(coordinates));
  const newCoord = map(maybeDistance, (distance) => ({
    distance,
    coordinates,
  }));

  return map(newCoord, ({ distance, coordinates }) => {
    const apparentMagnitude = magnitudeAt(star.apparentMagnitude, star.distance, distance);
    return {
      id: star.id,
      name: star.name,
      color: star.color,
      radius: star.radius,
      constellation: star.constellation,
      bayer: star.bayer,
      flamsteed: star.flamsteed,
      coordinates,
      distance,
      apparentMagnitude,
    };
  });
}

export function formatName(star: Star): string {
  return (star.name ? star.name + ', ' : '') + (star.bayer || star.flamsteed) + ' - ' + toFullName(star.constellation);
}

export function formatDistance(star: Star): string {
  const distance = star.distance;
  return distance < 10e-5 ? round(toKm(distance), 3) + 'Km' : round(toLightYear(distance), 5) + ' Light-years';
}
