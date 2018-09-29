import * as React from 'react';
import { Parsec } from '../measures/parsec';
import { Vector3D } from '../geometry/vectors';
import { round } from '../utils/number';
import { Rotation } from '../geometry/rotation';
import Tooltip from 'rc-tooltip';

type Props = {
  acceleration: Parsec;
  position: Vector3D;
  rotation: Rotation;
};

export const Informations = (props: Props) => {
  const formatedPostion = props.position.map((coordinate) => round(coordinate, 5));

  return (
    <div>
      <ul>
        <li>
          Acceleration: <em>{round(props.acceleration)}</em>
          <Tooltip
            placement="bottom"
            overlay={
              <span>
                <a href="https://en.wikipedia.org/wiki/Parsec">Parsec</a> is a measurement of distance roughly equals to
                3.26 light-years or 30 trillions kilometers.
                <br />
                The nearest star from earth is{' '}
                <a href="https://en.wikipedia.org/wiki/Proxima_Centauri">Proxima Centauri</a>, which is ~1.3 Parsec from
                earth.
              </span>
            }
            destroyTooltipOnHide={true}
          >
            <span> Parsec</span>
          </Tooltip>
        </li>
        <li>
          Postion:
          <ul>
            <li>
              X: <em>{formatedPostion[0]}</em> Parsec
            </li>
            <li>
              Y: <em>{formatedPostion[1]}</em> Parsec
            </li>
            <li>
              Z: <em>{formatedPostion[2]}</em> Parsec
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
