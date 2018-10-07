import * as React from 'react';
import { Parsec, toLightYear } from '../measures/parsec';
import { Vector3D, vectorLength } from '../geometry/vectors';
import { round } from '../utils/number';
import { Rotation } from '../geometry/rotation';
import Tooltip from 'rc-tooltip';
import { formatDistance, formatName, Star } from '../hygdata/hygdata.utils';
import './informations.css';

type Props = {
  nearestStar: Star | null;
  acceleration: Parsec;
  position: Vector3D;
  rotation: Rotation;
};

export const Informations = (props: Props) => {
  const formatedPostion = props.position.map((coordinate) => round(toLightYear(coordinate), 5));
  const nearestStar = props.nearestStar;
  return (
    <div>
      <ul>
        <li>
          {nearestStar ? (
            <>
              Nearest star is {formatName(nearestStar)} at {formatDistance(nearestStar)}
            </>
          ) : (
            <span className="ellipsis-loading">Computing nearest star</span>
          )}
        </li>

        <li>
          Acceleration: <em>{round(toLightYear(props.acceleration))}</em>
          <Tooltip
            placement="bottom"
            overlay={
              <span>
                <a href="https://en.wikipedia.org/wiki/Light-year">Light-years</a> is a measurement of distance roughly
                equals to 9.461 trillions kilometers.
                <br />
                The nearest star from earth is{' '}
                <a href="https://en.wikipedia.org/wiki/Proxima_Centauri">Proxima Centauri</a>, which is ~4.24
                Light-years from earth.
              </span>
            }
            destroyTooltipOnHide={true}
          >
            <span> Light-Years</span>
          </Tooltip>
        </li>
        <li>Distance from sun: {round(toLightYear(vectorLength(props.position)))} Light-years</li>
        <li>
          Postion:
          <ul>
            <li>
              X: <em>{formatedPostion[0]}</em> Light-years
            </li>
            <li>
              Y: <em>{formatedPostion[1]}</em> Light-years
            </li>
            <li>
              Z: <em>{formatedPostion[2]}</em> Light-years
            </li>
          </ul>
        </li>
        <li>
          Rotation:
          <ul>
            <li>
              Lambda: <em>{round(props.rotation.rotateLambda)}</em> ˚
            </li>
            <li>
              Phi: <em>{round(props.rotation.rotatePhi)}</em> ˚
            </li>
            <li>
              Gamma: <em>{round(props.rotation.rotateGamma)}</em> ˚
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
