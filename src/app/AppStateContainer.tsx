import * as React from 'react';
import { AppState } from './AppState';
import { App } from './App';
import { mkDegree, toRadians } from '../geometry/euler-angle';
import { add, minParsec, mkParsec } from '../measures/parsec';
import { debounce } from 'lodash';
import { Star } from '../hygdata/hygdata.utils';
import { Spinner } from '../spinner/spinner';

const baseAcceleration = mkParsec(0.000001);

export class AppStateContainer extends React.Component<{}, AppState> {
  state: AppState = {
    baseStars: null,
    baseConstellation: null,
    currentAcceleration: baseAcceleration,
    maxMagnitude: 4.5,
    rotation: {
      rotateLambda: 0,
      rotatePhi: 0,
      rotateGamma: 0,
    },
    position: [0, 0, 0],
    displayConstellation: true,
  };

  private reinitAcceleration = debounce(() => {
    this.setState((s) => ({ ...s, currentAcceleration: baseAcceleration }));
  }, 300);

  private keyPressListener = (e: KeyboardEvent) => {
    if (!e.srcElement || e.srcElement.tagName.toLowerCase() !== 'input') {
      const lon = toRadians(mkDegree(this.state.rotation.rotateLambda));
      const lat = toRadians(mkDegree(this.state.rotation.rotatePhi));

      const acceleration = e.shiftKey ? 1 : this.state.currentAcceleration;
      const x = Math.cos(lat) * Math.cos(lon) * acceleration;
      const y = Math.cos(lat) * Math.sin(lon) * acceleration;
      const z = -Math.sin(lat) * acceleration;

      const s = this.state;
      const newAcceleration =
        s.currentAcceleration < 2
          ? add(s.currentAcceleration, minParsec(mkParsec(0.003), s.currentAcceleration))
          : s.currentAcceleration;

      if (e.key === 'ArrowUp') {
        this.setState((state) => ({
          ...state,
          currentAcceleration: newAcceleration,
          position: [s.position[0] + x, s.position[1] + y, s.position[2] + z],
        }));
        this.reinitAcceleration();
      } else if (e.key === 'ArrowDown') {
        this.setState((state) => ({
          ...state,
          currentAcceleration: newAcceleration,
          position: [s.position[0] - x, s.position[1] - y, s.position[2] - z],
        }));
        this.reinitAcceleration();
      } else if (e.code === 'KeyW') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotatePhi: state.rotation.rotatePhi - 3 },
        }));
      } else if (e.code === 'KeyS') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotatePhi: state.rotation.rotatePhi + 3 },
        }));
      } else if (e.code === 'KeyA') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotateLambda: state.rotation.rotateLambda + 3 },
        }));
      } else if (e.code === 'KeyD') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotateLambda: state.rotation.rotateLambda - 3 },
        }));
      } else if (e.code === 'KeyQ') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotateGamma: state.rotation.rotateGamma + 3 },
        }));
      } else if (e.code === 'KeyE') {
        this.setState((state) => ({
          ...state,
          rotation: { ...state.rotation, rotateGamma: state.rotation.rotateGamma - 3 },
        }));
      }
    }
  };

  componentDidMount() {
    fetch('data/precomputation.json')
      .then((r) => r.json())
      .then((json: { stars: { [key: string]: Star }; constellations: Array<Array<string>> }) => {
        this.setState((s) => ({ ...s, baseGeoJson: json.stars, baseConstellation: json.constellations }));
      });

    document.addEventListener('keydown', this.keyPressListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressListener);
  }

  render() {
    const baseStars = this.state.baseStars;
    const baseConstellation = this.state.baseConstellation;
    if (!!baseStars && !!baseConstellation) {
      return (
        <App
          baseStarDictionnary={baseStars}
          baseConstellation={baseConstellation}
          acceleration={this.state.currentAcceleration}
          maxMagnitude={this.state.maxMagnitude}
          displayConstellation={this.state.displayConstellation}
          position={this.state.position}
          rotation={this.state.rotation}
          updateState={(partialState) => this.setState((previousState) => ({ ...previousState, ...partialState }))}
        />
      );
    } else {
      //todo beautiful LOADING
      return (
        <div
          style={{
            position: 'fixed',
            top: '45%',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Spinner/>
        </div>
      );
    }
  }
}
