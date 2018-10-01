import { StarMap } from './star-map';
import * as React from 'react';
import { Rotation } from '../geometry/rotation';
import { moveOrigin, Star } from '../hygdata/hygdata.utils';
import { convertConstellationToGeoJson, emptyConstellations } from '../constellations/constellations';
import reduce from 'lodash/reduce';
import { Vector3D } from '../geometry/vectors';
import { LineString, Point } from 'geojson';
import { isError } from '../utils/validated';
import { xyzToLonLat } from '../geometry/coordinates';
import { ConstellationWithUniqueId, StarDictionnary, StarDictionnaryWithUniqueId } from '../app/AppState';

type Props = {
  starDictionnary: StarDictionnaryWithUniqueId;
  constellations: ConstellationWithUniqueId;
  rotation: Rotation;
  updateRotation: (rotation: Rotation) => void;
  maxMagnitude: number;
  position: Vector3D;
  displayConstellation: boolean;
};

let starCache: { [key: string]: GeoJSON.FeatureCollection<Point, Star> } = {};
let constellationCache: { [key: string]: GeoJSON.FeatureCollection<LineString, {}> } = {};

export const StarMapContainer = (props: Props) => {
  let geoJson: GeoJSON.FeatureCollection<Point, Star>;
  const starId = props.starDictionnary.id + '-' + props.maxMagnitude + '-' + props.position;
  if (starCache[starId]) {
    geoJson = starCache[starId];
  } else {
    geoJson = computeGeoJson(props.starDictionnary.stars, props.maxMagnitude, props.position);
    starCache = { [starId]: geoJson };
  }

  let constellation: GeoJSON.FeatureCollection<LineString, {}>;
  const constellationId =
    props.starDictionnary.id + '-' + props.position + '-' + props.constellations.id + '-' + props.displayConstellation;
  if (constellationCache[constellationId]) {
    constellation = constellationCache[constellationId];
  } else {
    constellation = props.displayConstellation
      ? convertConstellationToGeoJson(props.constellations.constellations, props.starDictionnary.stars, props.position)
      : emptyConstellations;
    constellationCache = { [constellationId]: constellation };
  }

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
  stars: StarDictionnary,
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
          if (newStar.apparentMagnitude > maxMagnitude) {
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
              acc.push(newValue);
              return acc;
            }
          }
        }
      },
      []
    ),
  };
}
