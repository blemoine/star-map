import * as React from 'react';
import { Controls } from '../controls/controls';
import { StarMap } from '../map/star-map';
import { geoJsonCollect, moveOrigin, Star } from '../hygdata/hygdata.utils';
import { Point } from 'geojson';
import { isError } from '../utils/validated';
import { decRaToGeo } from '../geometry/coordinates';
import { AppState } from './AppState';
import { Vector3D } from '../geometry/vectors';
import { Rotation } from '../geometry/rotation';
import { Parsec } from '../measures/parsec';
import { Informations } from '../informations/informations';
import { convertConstellationToGeoJson, emptyConstellations } from '../constellations/constellations';

function computeGeoJson(baseGeoJson: GeoJSON.FeatureCollection<Point, Star>, maxMagnitude: number, position: Vector3D) {
  return geoJsonCollect(
    baseGeoJson,
    (f: GeoJSON.Feature<Point, Star>) => {
      return f.properties.apparentMagnitude < maxMagnitude;
    },
    (f: GeoJSON.Feature<Point, Star>) => {
      const oldStar: Star = f.properties;
      const newStar = moveOrigin(position, oldStar);
      if (isError(newStar)) {
        console.error(newStar.errors());
        return f;
      } else {
        const coordinates = decRaToGeo([newStar.dec, newStar.ra]);
        if (isError(coordinates)) {
          console.error(coordinates.errors());
          return f;
        }

        return {
          id: f.id,
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
          properties: newStar,
        };
      }
    }
  );
}

export const App = (props: {
  baseGeoJson: GeoJSON.FeatureCollection<Point, Star>;
  baseConstellation: Array<Array<[string, string]>>;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  acceleration: Parsec;
  displayConstellation: boolean;
  updateState: (s: Partial<AppState>) => void;
}) => {
  const geoJson = computeGeoJson(props.baseGeoJson, props.maxMagnitude, props.position);
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
          {geoJson ? (
            <StarMap
              constellation={constellation}
              geoJson={geoJson}
              rotation={props.rotation}
              rotationChange={(rotation) => props.updateState({ rotation })}
            />
          ) : (
            //TODO beautiful loadin
            'LOADING...'
          )}
        </div>
      </>
    );
  }
};
