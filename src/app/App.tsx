import * as React from 'react';
import { Controls } from '../controls/controls';
import { StarMap } from '../map/star-map';
import { moveOrigin, Star } from '../hygdata/hygdata.utils';
import { Point } from 'geojson';
import { isError } from '../utils/validated';
import { xyzToLonLat } from '../geometry/coordinates';
import { AppState } from './AppState';
import { Vector3D } from '../geometry/vectors';
import { Rotation } from '../geometry/rotation';
import { Parsec } from '../measures/parsec';
import { Informations } from '../informations/informations';
import { convertConstellationToGeoJson, emptyConstellations } from '../constellations/constellations';
import { flatten, reduce } from 'lodash';

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

export const App = (props: {
  baseStarDictionnary: { [key: string]: Star };
  baseConstellation: Array<Array<string>>;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  acceleration: Parsec;
  displayConstellation: boolean;
  updateState: (s: Partial<AppState>) => void;
}) => {
  const mandatoryStars = flatten(props.baseConstellation);
  const geoJson = computeGeoJson(props.baseStarDictionnary, mandatoryStars, props.maxMagnitude, props.position);

  if (isError(geoJson)) {
    console.error(geoJson.errors());
    // TODO beautiful error
    return <div>ERROR geoJson</div>;
  } else {
    const constellation = props.displayConstellation
      ? convertConstellationToGeoJson(props.baseConstellation, geoJson)
      : emptyConstellations;

    return (
      <>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            minHeight: '50px',
            backgroundColor: 'rgba(55,55,55,0.8)',
          }}
        >
          <Controls
            displayConstellation={props.displayConstellation}
            displayConstellationChange={(displayConstellation) => props.updateState({ displayConstellation })}
            magnitude={props.maxMagnitude}
            magnitudeChange={(maxMagnitude) => props.updateState({ maxMagnitude })}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            width: '300px',
            top: '100px',
            left: 0,
            border: '1px solid #AAA',
            backgroundColor: 'rgba(55,55,55,0.8)',
          }}
        >
          <Informations acceleration={props.acceleration} position={props.position} rotation={props.rotation} />
        </div>
        <div className="main-wrapper" style={{ width: '100vw', height: '100vh' }}>
          <StarMap
            constellation={constellation}
            geoJson={geoJson}
            rotation={props.rotation}
            rotationChange={(rotation) => props.updateState({ rotation })}
          />
        </div>
      </>
    );
  }
};
