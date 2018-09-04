import { Quaternion } from './quaternion';

export declare class DegreeTag {
  private _kind: 'degree';
}
export type Degree = number & DegreeTag;
export function mkDegree(n: number): Degree {
  return n as Degree;
}

declare class RadianTag {
  private _kind: 'radian';
}
export type Radian = number & RadianTag;
export function mkRadian(n: number): Radian {
  return n as Radian;
}

export function toRadians(d: Degree): Radian {
  return mkRadian((d * Math.PI) / 180);
}
export function toDegree(r: Radian): Degree {
  return mkDegree((r * 180) / Math.PI);
}

function multiplyDegree(n: number, t: Degree): Degree {
  return mkDegree(t * n);
}

export function euler2quat(e: [Degree, Degree, Degree]): Quaternion {
  const roll = toRadians(multiplyDegree(0.5, e[0])),
    pitch = toRadians(multiplyDegree(0.5, e[1])),
    yaw = toRadians(multiplyDegree(0.5, e[2])),
    sr = Math.sin(roll),
    cr = Math.cos(roll),
    sp = Math.sin(pitch),
    cp = Math.cos(pitch),
    sy = Math.sin(yaw),
    cy = Math.cos(yaw),
    qi = sr * cp * cy - cr * sp * sy,
    qj = cr * sp * cy + sr * cp * sy,
    qk = cr * cp * sy - sr * sp * cy,
    qr = cr * cp * cy + sr * sp * sy;

  return [qr, qi, qj, qk];
}

function atan2(n1: number, n2: number, ): Radian {
  return mkRadian(Math.atan2(n1, n2))
}
function asin(n1: number, ): Radian {
  return mkRadian(Math.asin(n1))
}

// This function computes quaternion to euler angles
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
export function quat2euler(t: Quaternion): [Degree, Degree, Degree] {
  return [
    toDegree(atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2]))),
    toDegree(asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1]))))),
    toDegree(atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3]))),
  ];
}
