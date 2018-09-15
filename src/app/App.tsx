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
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  updateState: (s: Partial<AppState>) => void;
}) => {
  const geoJson = computeGeoJson(props.baseGeoJson, props.maxMagnitude, props.position);
  if (isError(geoJson)) {
    console.error(geoJson.errors());
    // TODO beautiful error
    return <div>ERROR</div>;
  } else {
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
            magnitude={props.maxMagnitude}
            magnitudeChange={(maxMagnitude) => props.updateState({ maxMagnitude })}
            rotation={props.rotation}
            rotationChange={(rotation) => props.updateState({ rotation })}
            position={props.position}
            positionChange={(position) => props.updateState({ position })}
          />
        </div>
        <div className="main-wrapper" style={{ width: '100vw', height: '100vh' }}>
          {geoJson ? (
            <StarMap
              geoJson={geoJson}
              rotation={props.rotation}
              rotationChange={(rotation) => props.updateState({ rotation })}
            />
          ) : (
            'LOADING...'
          )}
        </div>
      </>
    );
  }
};
