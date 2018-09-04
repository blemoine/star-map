import { cross, dot, Vector3D } from './vectors';

export type Quaternion = [number, number, number, number];

export function quaternionForRotation(
  v0: Vector3D,
  v1: Vector3D
): Quaternion | null {
  const w = cross(v0, v1), // vector pendicular to v0 & v1
    w_len = Math.sqrt(dot(w, w)); // length of w

  if (w_len == 0) return null;

  const theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1))));

  const qi = (w[2] * Math.sin(theta)) / w_len;
  const qj = (-w[1] * Math.sin(theta)) / w_len;
  const qk = (w[0] * Math.sin(theta)) / w_len;
  const qr = Math.cos(theta);
  if (Number.isFinite(theta)) {
    return [qr, qi, qj, qk];
  } else {
    return null;
  }
}


export function multiplyQuaternion(
  q1: Quaternion,
  q2: Quaternion
): Quaternion {
  const a = q1[0],
    b = q1[1],
    c = q1[2],
    d = q1[3],
    e = q2[0],
    f = q2[1],
    g = q2[2],
    h = q2[3];

  return [
    a * e - b * f - c * g - d * h,
    b * e + a * f + c * h - d * g,
    a * g - b * h + c * e + d * f,
    a * h + b * g - c * f + d * e,
  ];
}