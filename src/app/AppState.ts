import { Star } from '../hygdata/hygdata.utils';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';
import { Parsec } from '../measures/parsec';

export type StarDictionnary = { [key: string]: Star };
export type StarDictionnaryWithUniqueId = { id: string; stars: StarDictionnary };
export type ConstellationWithUniqueId = { id: string; constellations: Array<Array<string>> };

export type AppState = {
  baseStars: StarDictionnaryWithUniqueId | null;
  baseConstellation: ConstellationWithUniqueId | null;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  currentAcceleration: Parsec;
  displayConstellation: boolean;
};
