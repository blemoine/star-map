import * as React from 'react';
import { Controls } from '../controls/controls';
import { Star } from '../hygdata/hygdata.utils';
import { AppState } from './AppState';
import { Vector3D } from '../geometry/vectors';
import { Rotation } from '../geometry/rotation';
import { Parsec } from '../measures/parsec';
import { Informations } from '../informations/informations';
import { StarMapContainer } from '../map/star-map.container';

type Props = {
  baseStarDictionnary: { [key: string]: Star };
  baseConstellation: Array<Array<string>>;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  acceleration: Parsec;
  displayConstellation: boolean;
  updateState: (s: Partial<AppState>) => void;
};
export const App = (props: Props) => {
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
        <StarMapContainer
          starDictionnary={props.baseStarDictionnary}
          constellations={props.baseConstellation}
          rotation={props.rotation}
          updateRotation={(rotation) => props.updateState({ rotation })}
          maxMagnitude={props.maxMagnitude}
          position={props.position}
          displayConstellation={props.displayConstellation}
        />
      </div>
    </>
  );
};
