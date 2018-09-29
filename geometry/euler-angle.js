"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mkDegree(n) {
    return n;
}
exports.mkDegree = mkDegree;
function mkRadian(n) {
    return n;
}
exports.mkRadian = mkRadian;
function toRadians(d) {
    return mkRadian((d * Math.PI) / 180);
}
exports.toRadians = toRadians;
function toDegree(r) {
    const n = (r * 180) / Math.PI;
    return mkDegree(n);
}
exports.toDegree = toDegree;
function multiplyDegree(n, t) {
    return mkDegree(t * n);
}
function euler2quat(e) {
    const roll = toRadians(multiplyDegree(0.5, e[0])), pitch = toRadians(multiplyDegree(0.5, e[1])), yaw = toRadians(multiplyDegree(0.5, e[2])), sr = Math.sin(roll), cr = Math.cos(roll), sp = Math.sin(pitch), cp = Math.cos(pitch), sy = Math.sin(yaw), cy = Math.cos(yaw), qi = sr * cp * cy - cr * sp * sy, qj = cr * sp * cy + sr * cp * sy, qk = cr * cp * sy - sr * sp * cy, qr = cr * cp * cy + sr * sp * sy;
    return [qr, qi, qj, qk];
}
exports.euler2quat = euler2quat;
// This function computes quaternion to euler angles
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function quat2euler(t) {
    return [
        toDegree(Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2]))),
        toDegree(Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1]))))),
        toDegree(Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3]))),
    ];
}
exports.quat2euler = quat2euler;
