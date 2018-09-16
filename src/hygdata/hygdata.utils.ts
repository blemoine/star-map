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
import { Vector3D, vectorLength } from '../geometry/vectors';
import { GeometryObject } from 'geojson';

export type Star = {
  name: string;
  ra: RightAscension;
  dec: Declination;
  distance: Parsec;
  apparentMagnitude: number;
};

export function magnitudeAt(baseMagnitude: number, baseDistance: Parsec, newDistance: Parsec): number {
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
      const maybeDistance = mkParsec(vectorLength(xyz));
      return map(maybeDistance, (distance) => ({
        ra,
        dec,
        distance,
      }));
    });
  });

  return map(newCoord, ({ dec, ra, distance }) => {
    const apparentMagnitude = magnitudeAt(star.apparentMagnitude, star.distance, distance);
    return {
      name: star.name,
      ra,
      dec,
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
