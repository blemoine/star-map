import * as React from 'react';
import './controls.css';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';

type Props = {
  magnitude: number;
  magnitudeChange: (magnitude: number) => void;
  rotation: Rotation;
  rotationChange: (rotation: Rotation) => void;
  position: Vector3D;
  positionChange: (position: Vector3D) => void;
};
export const Controls = (props: Props) => {
  return (
    <>
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
            onChange={(e) => props.rotationChange({ ...props.rotation, rotateLambda: parseFloat(e.target.value) })}
            step={1}
          />
        </div>
        <div className="form-element">
          <label>Phi</label>
          <input
            type="number"
            value={props.rotation.rotatePhi}
            onChange={(e) => props.rotationChange({ ...props.rotation, rotatePhi: parseFloat(e.target.value) })}
            step={1}
          />
        </div>
        <div className="form-element">
          <label>Gamma</label>
          <input
            type="number"
            value={props.rotation.rotateGamma}
            onChange={(e) => props.rotationChange({ ...props.rotation, rotateGamma: parseFloat(e.target.value) })}
            step={1}
          />
        </div>
      </div>
      <div className="controls-wrapper">
        <div className="form-element">
          <label>X</label>
          <input
            type="number"
            value={props.position[0]}
            onChange={(e) => props.positionChange([parseFloat(e.target.value), props.position[1], props.position[2]])}
            step={1}
          />
        </div>

        <div className="form-element">
          <label>Y</label>
          <input
            type="number"
            value={props.position[1]}
            onChange={(e) => props.positionChange([props.position[0], parseFloat(e.target.value), props.position[2]])}
            step={1}
          />
        </div>

        <div className="form-element">
          <label>W</label>
          <input
            type="number"
            value={props.position[2]}
            onChange={(e) => props.positionChange([props.position[0], props.position[1], parseFloat(e.target.value)])}
            step={1}
          />
        </div>
      </div>
    </>
  );
};
