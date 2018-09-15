import * as React from 'react';
import { parse } from 'papaparse';
import { convertToGeoJson } from '../hygdata/hygdata';
import { isError } from '../utils/validated';
import { AppState } from './AppState';
import { App } from './App';
import { mkDegree, toRadians } from '../geometry/euler-angle';

export class AppStateContainer extends React.Component<{}, AppState> {
  state: AppState = {
    baseGeoJson: null,
    maxMagnitude: 4,
    rotation: {
      rotateLambda: 0,
      rotatePhi: 0,
      rotateGamma: 0,
    },
    position: [0, 0, 0],
  };
  private keyPressListener = (e: KeyboardEvent) => {
    if (!e.srcElement || e.srcElement.tagName.toLowerCase() !== 'input') {
      const lon = toRadians(mkDegree(this.state.rotation.rotateLambda));
      const lat = toRadians(mkDegree(this.state.rotation.rotatePhi));

      const x = Math.cos(lat) * Math.cos(lon);
      const y = Math.cos(lat) * Math.sin(lon);
      const z = -Math.sin(lat);

      const s = this.state;
      //TODO refactor c'est la meme fonction que lonlat2xyz
      if (e.key === 'ArrowUp') {
        this.setState((state) => ({ ...state, position: [s.position[0] + x, s.position[1] + y, s.position[2] + z] }));
      } else if (e.key === 'ArrowDown') {
        this.setState((state) => ({ ...state, position: [s.position[0] - x, s.position[1] - y, s.position[2] - z] }));
      }
    }
  };

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
          this.setState((s) => ({ ...s, baseGeoJson: geoJson }));
        }
      });
    document.addEventListener('keydown', this.keyPressListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressListener);
  }

  render() {
    const baseGeoJson = this.state.baseGeoJson;
    if (!!baseGeoJson) {
      return (
        <App
          baseGeoJson={baseGeoJson}
          maxMagnitude={this.state.maxMagnitude}
          position={this.state.position}
          rotation={this.state.rotation}
          updateState={(partialState) => this.setState((previousState) => ({ ...previousState, ...partialState }))}
        />
      );
    } else {
      //todo beautiful LOADING
      return <div>LOADING</div>;
    }
  }
}
