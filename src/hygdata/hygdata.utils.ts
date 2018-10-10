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

export type StarInterchangeFormat = [
  string,
  string,
  Parsec,
  number,
  number,
  number,
  number,
  Parsec | null,
  string,
  string | null,
  string | null,
  number,
  number,
  number
];

export function interchangeToStar(interchangeFormat: StarInterchangeFormat): Star {
  return {
    id: interchangeFormat[0],
    name: interchangeFormat[1],
    distance: interchangeFormat[2],
    apparentMagnitude: interchangeFormat[3],
    color: [interchangeFormat[4], interchangeFormat[5], interchangeFormat[6]],
    radius: interchangeFormat[7],
    constellation: interchangeFormat[8],
    bayer: interchangeFormat[9],
    flamsteed: interchangeFormat[10],
    coordinates: [interchangeFormat[11], interchangeFormat[12], interchangeFormat[13]],
  };
}

export function starToInterchange(star: Star): StarInterchangeFormat {
  return [
    star.id,
    star.name,
    star.distance,
    star.apparentMagnitude,
    star.color[0],
    star.color[1],
    star.color[2],
    star.radius,
    star.constellation,
    star.bayer,
    star.flamsteed,
    star.coordinates[0],
    star.coordinates[1],
    star.coordinates[2],
  ];
}

export function magnitudeAt(baseMagnitude: number, baseDistance: Parsec, newDistance: Parsec): number {
  return baseMagnitude + 5 * Math.log10(newDistance / baseDistance);
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
