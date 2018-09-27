import { Star } from '../hygdata/hygdata.utils';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';
import { Parsec } from '../measures/parsec';

export type AppState = {
  baseStars: { [key: string]: Star } | null;
  baseConstellation: Array<Array<string>> | null;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  currentAcceleration: Parsec;
  displayConstellation: boolean;
};
