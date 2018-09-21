import * as React from 'react';
import './controls.css';

type Props = {
  displayConstellation: boolean;
  displayConstellationChange: (displayConstellation: boolean) => void;
  magnitude: number;
  magnitudeChange: (magnitude: number) => void;
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
        <button onClick={() => props.displayConstellationChange(!props.displayConstellation)}>
          {props.displayConstellation ? 'Hide Constellations' : 'Show Constellations'}
        </button>
      </div>
    </div>
  );
};
