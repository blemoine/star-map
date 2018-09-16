import * as React from 'react';
import './controls.css';

type Props = {
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
      </div>
  );
};
