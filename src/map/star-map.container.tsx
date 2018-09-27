import { StarMap } from './star-map';
import * as React from 'react';
import { Rotation } from '../geometry/rotation';
import { moveOrigin, Star } from '../hygdata/hygdata.utils';
import { convertConstellationToGeoJson, emptyConstellations } from '../constellations/constellations';
import { flatten, reduce } from 'lodash';
import { Vector3D } from '../geometry/vectors';
import { Point } from 'geojson';
import { isError } from '../utils/validated';
import { xyzToLonLat } from '../geometry/coordinates';

type Props = {
  starDictionnary: { [key: string]: Star };
  constellations: Array<Array<string>>;
  rotation: Rotation;
  updateRotation: (rotation: Rotation) => void;
  maxMagnitude: number;
  position: Vector3D;
  displayConstellation: boolean;
};

export const StarMapContainer = (props: Props) => {
  const mandatoryStars = flatten(props.constellations);
  const geoJson = computeGeoJson(props.starDictionnary, mandatoryStars, props.maxMagnitude, props.position);

  const constellation = props.displayConstellation
    ? convertConstellationToGeoJson(props.constellations, geoJson)
    : emptyConstellations;

  return (
    <StarMap
      constellation={constellation}
      geoJson={geoJson}
      rotation={props.rotation}
      rotationChange={(rotation) => props.updateRotation(rotation)}
    />
  );
};

function computeGeoJson(
  stars: { [key: string]: Star },
  mandatoryStars: Array<string>,
  maxMagnitude: number,
  position: Vector3D
): GeoJSON.FeatureCollection<Point, Star> {
  return {
    type: 'FeatureCollection',
    features: reduce(
      stars,
      (acc: Array<GeoJSON.Feature<Point, Star>>, oldStar) => {
        const newStar = moveOrigin(position, oldStar);
        if (isError(newStar)) {
          console.error(newStar.errors());
          return acc;
        } else {
          const coordinates = xyzToLonLat(newStar.coordinates);
          if (isError(coordinates)) {
            console.error(newStar, coordinates.errors());
            return acc;
          } else {
            const newValue: GeoJSON.Feature<Point, Star> = {
              id: oldStar.id,
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
              properties: newStar,
            };
            if (newStar.apparentMagnitude < maxMagnitude || mandatoryStars.indexOf(newStar.id) >= 0) {
              acc.push(newValue);
            }
            return acc;
          }
        }
      },
      []
    ),
  };
}
