import * as React from 'react';
import { StarMap } from '../map/star-map';
import { Point } from 'geojson';
import { convertToGeoJson, HygProperty } from '../hygdata/hygdata';
import { parse } from 'papaparse';
import { isError } from '../utils/validated';
import { Controls } from '../controls/controls';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';
import { mkDegree, toRadians } from '../geometry/euler-angle';
import { geoJsonCollect, moveOrigin, Star } from '../hygdata/hygdata.utils';
import { decRaToGeo } from '../geometry/coordinates';

type State = {
  geoJson: GeoJSON.FeatureCollection<Point, HygProperty> | null;
  rotation: Rotation;
  maxMagnitude: number;
  position: Vector3D;
};

export class App extends React.Component<{}, State> {
  state: State = {
    geoJson: null,
    maxMagnitude: 4,
    rotation: {
      rotateLambda: 0,
      rotatePhi: 0,
      rotateGamma: 0,
    },
    position: [0, 0, 0],
  };

  private baseGeoJson: GeoJSON.FeatureCollection<Point, HygProperty> | null = null;

  private keyPressListener = (e: KeyboardEvent) => {
    const lon = toRadians(mkDegree(this.state.rotation.rotateLambda));
    const lat = toRadians(mkDegree(this.state.rotation.rotatePhi));

    const x = Math.cos(lat) * Math.cos(lon);
    const y = Math.cos(lat) * Math.sin(lon);
    const z = -Math.sin(lat);

    const s = this.state;
    //TODO refactor c'est la meme fonction que lonlat2xyz
    if (e.key === 'ArrowUp') {
      this.reloadGeoJson(this.state.maxMagnitude, [s.position[0] + x, s.position[1] + y, s.position[2] + z]);
    } else if (e.key === 'ArrowDown') {
      this.reloadGeoJson(this.state.maxMagnitude, [s.position[0] - x, s.position[1] - y, s.position[2] - z]);
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressListener);
  }

  componentDidMount() {
    fetch('data/hygdata_v3.csv')
      .then((r) => r.text())
      .then((rawCsv) => {
        const parsed = parse(rawCsv);
        if (parsed.errors.length > 0) {
          /*
          TODO display errors ?
          const [headError, ...tailErrors] = parsed.errors;

          const baseErr = raise(headError.message, headError);
          return tailErrors.reduce((err, e) => err.combine(raise(e.message, e)), baseErr);
          */
          console.error(parsed.errors);
        }
        const csv = parsed.data;
        const geoJson = convertToGeoJson(csv);
        if (isError(geoJson)) {
          console.error(geoJson.errors());
        } else {
          this.baseGeoJson = geoJson;
          this.reloadGeoJson(this.state.maxMagnitude, this.state.position);
        }
      });
  }

  private reloadGeoJson(maxMagnitude: number, position: Vector3D) {
    if (!this.baseGeoJson) {
      throw new Error('At this point, baseGeoJson should be set');
    }
    const geoJson = geoJsonCollect(
      this.baseGeoJson,
      (f: GeoJSON.Feature<Point, HygProperty>) => {
        return f.properties.magnitude < maxMagnitude;
      },
      (f: GeoJSON.Feature<Point, HygProperty>) => {
        const oldStar: Star = {
          ra: f.properties.ra,
          dec: f.properties.dec,
          distance: f.properties.distance,
          apparentMagnitude: f.properties.magnitude,
        };
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
            properties: {
              magnitude: newStar.apparentMagnitude,
              name,
              distance: newStar.distance,
              ra: newStar.ra,
              dec: newStar.dec,
            },
          };
        }
      }
    );

    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      this.setState((prevState) => ({ ...prevState, geoJson, maxMagnitude, position }));
      document.addEventListener('keydown', this.keyPressListener);
    }
  }

  private updateMagnitude(maxMagnitude: number) {
    this.reloadGeoJson(maxMagnitude, this.state.position);
  }

  private updateRotation(rotation: Rotation) {
    this.setState((s) => ({ ...s, rotation }));
  }

  render() {
    const geoJson = this.state.geoJson;

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
            magnitude={this.state.maxMagnitude}
            magnitudeChange={(magnitude) => this.updateMagnitude(magnitude)}
            rotation={this.state.rotation}
            rotationChange={(rotation) => this.updateRotation(rotation)}
          />
        </div>
        <div className="main-wrapper" style={{ width: '100vw', height: '100vh' }}>
          {geoJson ? (
            <StarMap
              geoJson={geoJson}
              rotation={this.state.rotation}
              rotationChange={(rotation) => this.updateRotation(rotation)}
            />
          ) : (
            'LOADING...'
          )}
        </div>
      </>
    );
  }
}
