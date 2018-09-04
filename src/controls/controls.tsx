import * as React from 'react';
import './controls.css'
import { Rotation } from '../geometry/rotation';

type Props = {
  magnitude: number;
  magnitudeChange: (magnitude: number) => void;
  rotation: Rotation;
  rotationChange: (rotation:Rotation) => void
};
export const Controls = (props: Props) => {
  return (
    <div className="controls-wrapper">
      <div className="form-element">
        <label>Magnitude</label>
        <input
          type="number"
          value={props.magnitude}
          onChange={(e) => props.magnitudeChange(parseFloat(e.target.value))}
          max={6}
          step={0.25}
        />
      </div>
      <div className="form-element">
        <label>Lambda</label>
        <input
          type="number"
          value={props.rotation.rotateLambda}
          onChange={(e) => props.rotationChange({...props.rotation, rotateLambda:parseFloat(e.target.value) })}
          step={1}
        />
      </div>
      <div className="form-element">
        <label>Phi</label>
        <input
          type="number"
          value={props.rotation.rotatePhi}
          onChange={(e) => props.rotationChange({...props.rotation, rotatePhi:parseFloat(e.target.value) })}
          step={1}
        />
      </div>
      <div className="form-element">
        <label>Gamma</label>
        <input
          type="number"
          value={props.rotation.rotateGamma}
          onChange={(e) => props.rotationChange({...props.rotation, rotateGamma:parseFloat(e.target.value) })}
          step={1}
        />
      </div>

    </div>
  );
};
