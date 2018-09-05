import * as React from 'react';
import { StarMap } from '../map/star-map';
import { Point } from 'geojson';
import { convertToGeoJson, HygProperty } from '../hygdata/hygdata';
import { parse } from 'papaparse';
import {  isError } from '../utils/validated';
import { Controls } from '../controls/controls';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';

type State = {
  geoJson: GeoJSON.FeatureCollection<Point, HygProperty> | null;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
};

export class App extends React.Component<{}, State> {
  state: State = {
    geoJson: null,
    maxMagnitude: 6,
    rotation: {
      rotateLambda: 0.1,
      rotatePhi: 0,
      rotateGamma: 0,
    },
    position: [0, 0, 0],
  };

  private csv: Array<Array<string>> = [];

  private keyPressListener = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      this.setState((s: State) => ({
        ...s,
        position: [s.position[0], s.position[1], s.position[2] + 1],
      }));
      this.reloadGeoJson();
    } else if (e.key === 'ArrowDown') {
      this.setState(
        (s: State): State => ({
          ...s,
          position: [s.position[0], s.position[1], s.position[2] - 1],
        })
      );
      this.reloadGeoJson();
    } else if (e.key === 'ArrowLeft') {
      this.setState(
        (s: State): State => {
          return {
            ...s,
            position: [s.position[0] - 1, s.position[1], s.position[2]],
          };
        }
      );
      this.reloadGeoJson();
    } else if (e.key === 'ArrowRight') {
      this.setState((s: State) => ({
        ...s,
        position: [s.position[0] + 1, s.position[1], s.position[2]],
      }));
      this.reloadGeoJson();
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
        this.csv = parsed.data;
        this.reloadGeoJson();
      });
  }

  private reloadGeoJson() {
    //TODO
    const geoJson = convertToGeoJson(
      this.csv,
      this.state.position,
      (magnitude: number) => magnitude < this.state.maxMagnitude
    );
    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      this.setState((prevState) => ({ ...prevState, geoJson }));
      document.addEventListener('keydown', this.keyPressListener);
    }
  }

  private updateMagnitude(maxMagnitude: number) {
    this.setState((prevState) => ({ ...prevState, maxMagnitude }));
    const geoJson = convertToGeoJson(this.csv, this.state.position, (magnitude: number) => magnitude < maxMagnitude);
    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      this.setState((prevState) => ({ ...prevState, geoJson }));
    }
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
        <div className="main-wrapper">
          {geoJson ? (
            <StarMap
              geoJson={geoJson}
              rotation={this.state.rotation}
              rotationChange={(rotation) => this.updateRotation(rotation)}
              width="100vw"
              height="100vh"
            />
          ) : (
            'LOADING...'
          )}
        </div>
      </>
    );
  }
}
