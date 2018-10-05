import * as React from 'react';
import { AppState, StarDictionnary } from './AppState';
import { App } from './App';
import { mkDegree, toRadians } from '../geometry/euler-angle';
import { add, minParsec, mkParsec } from '../measures/parsec';
import debounce from 'lodash/debounce';

import { Spinner } from '../spinner/spinner';
import { uuid } from '../utils/uuid';
import { rafThrottle } from '../utils/raf-throttle';

const baseAcceleration = mkParsec(0.01);

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
    nearestStar: null,
    displayConstellation: true,
    selectedStar: null,
  };

  private reinitAcceleration = debounce(() => {
    this.setState((s) => ({ ...s, currentAcceleration: baseAcceleration }));
  }, 300);

  private throttledSetState = rafThrottle((fn: (s: AppState) => AppState) => {
    this.setState(fn);
  });

  private keyPressListener = (e: KeyboardEvent) => {
    if (!e.srcElement || e.srcElement.tagName.toLowerCase() !== 'input') {
      const lon = toRadians(mkDegree(this.state.rotation.rotateLambda));
      const lat = toRadians(mkDegree(this.state.rotation.rotatePhi));

      const acceleration = e.shiftKey ? 0.3 : this.state.currentAcceleration;
      const x = Math.cos(lat) * Math.cos(lon) * acceleration;
      const y = Math.cos(lat) * Math.sin(lon) * acceleration;
      const z = -Math.sin(lat) * acceleration;

      const s = this.state;
      const newAcceleration =
        s.currentAcceleration < 2
          ? add(s.currentAcceleration, minParsec(mkParsec(0.003), s.currentAcceleration))
          : s.currentAcceleration;

      if (e.key === 'ArrowUp') {
        this.throttledSetState((state) => ({
          ...state,
          currentAcceleration: newAcceleration,
          position: [s.position[0] + x, s.position[1] + y, s.position[2] + z],
        }));
        this.reinitAcceleration();
      } else if (e.key === 'ArrowDown') {
        this.throttledSetState((state) => ({
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
      .then((json: { stars: StarDictionnary; constellations: Array<Array<string>> }) => {
        this.setState(
          (s): AppState => ({
            ...s,
            baseStars: { id: uuid(), stars: json.stars },
            baseConstellation: { id: uuid(), constellations: json.constellations },
          })
        );
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
          nearestStar={this.state.nearestStar}
          baseStarDictionnary={baseStars}
          baseConstellation={baseConstellation}
          acceleration={this.state.currentAcceleration}
          maxMagnitude={this.state.maxMagnitude}
          displayConstellation={this.state.displayConstellation}
          position={this.state.position}
          rotation={this.state.rotation}
          updateState={(partialState) => this.setState((previousState) => ({ ...previousState, ...partialState }))}
          selectedStar={this.state.selectedStar}
        />
      );
    } else {
      return (
        <div
          style={{
            position: 'fixed',
            top: '45%',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Spinner />
        </div>
      );
    }
  }
}
