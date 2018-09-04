export type Vector3D = [number, number, number];

export function cross(v0: Vector3D, v1: Vector3D): Vector3D {
  return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}

export function dot(v0: Vector3D, v1: Vector3D): number {
  return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}
