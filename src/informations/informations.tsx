import * as React from 'react';
import { Parsec } from '../measures/parsec';
import { Vector3D } from '../geometry/vectors';
import { round } from '../utils/number';
import { Rotation } from '../geometry/rotation';

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
          Acceleration: <em>{round(props.acceleration)}</em> Parsec
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
