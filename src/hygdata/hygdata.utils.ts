import { mkParsec, Parsec } from '../measures/parsec';
import { map, Validated } from '../utils/validated';
import { Vector3D, vectorLength } from '../geometry/vectors';
import { GeometryObject } from 'geojson';

export type Star = {
  id: string;
  name: string;
  distance: Parsec;
  apparentMagnitude: number;
  color: [number, number, number];
  radius: Parsec | null;
  constellation: string;
  bayer: string | null;
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
      coordinates,
      distance,
      apparentMagnitude,
    };
  });
}

export function geoJsonCollect<G extends GeometryObject | null, P>(
  geoJson: GeoJSON.FeatureCollection<G, P>,
  filter: (f: GeoJSON.Feature<G, P>) => boolean,
  mapper: (f: GeoJSON.Feature<G, P>) => GeoJSON.Feature<G, P>
): GeoJSON.FeatureCollection<G, P> {
  return {
    type: geoJson.type,
    features: geoJson.features.reduce((acc: Array<GeoJSON.Feature<G, P>>, f) => {
      const newValue = mapper(f);
      if (filter(newValue)) {
        acc.push(newValue);
      }
      return acc;
    }, []),
  };
}
