import * as React from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
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
        <Tooltip
          placement="bottom"
          overlay={
            <span>
              The <a href="https://en.wikipedia.org/wiki/Apparent_magnitude">Magnitude</a> is a measurement of the
              luminosity of stars. The higher the magnitude, the less visible is the star. <br />
              The stars with magnitude greater than 6 are not visible with naked eyes. In cities, stars with magnitude
              greater than 3 are often not visible.
            </span>
          }
          destroyTooltipOnHide={true}
        >
          <label>Magnitude</label>
        </Tooltip>
        <input
          type="number"
          value={props.magnitude}
          onChange={(e) => props.magnitudeChange(parseFloat(e.target.value))}
          max={6}
          step={0.25}
        />
      </div>
      <div className="form-element">
        <Tooltip
          placement="bottom"
          overlay={
            <span>
              <a href="https://en.wikipedia.org/wiki/Constellation">Constellation</a> are often <em>drawn</em> from
              stars that have no other links than to be in same general direction. Those stars can in reality be really
              far from each others. <br />
              So, while staying in the neighbourhood (some light-years) of the solar system, the
              constellation will appear slightly deformed, the further you move, the less the constellation will make
              sense. That's why you can hide them if you want to navigate far into the galaxy.
            </span>
          }
          destroyTooltipOnHide={true}
        >
          <button onClick={() => props.displayConstellationChange(!props.displayConstellation)}>
            {props.displayConstellation ? 'Hide Constellations' : 'Show Constellations'}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
