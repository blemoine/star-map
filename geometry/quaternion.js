"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vectors_1 = require("./vectors");
function quaternionForRotation(v0, v1) {
    const w = vectors_1.cross(v0, v1);
    const w_len = vectors_1.vectorLength(w);
    if (w_len == 0)
        return null;
    const theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, vectors_1.dot(v0, v1))));
    const qi = (w[2] * Math.sin(theta)) / w_len;
    const qj = (-w[1] * Math.sin(theta)) / w_len;
    const qk = (w[0] * Math.sin(theta)) / w_len;
    const qr = Math.cos(theta);
    if (Number.isFinite(theta)) {
        return [qr, qi, qj, qk];
    }
    else {
        return null;
    }
}
exports.quaternionForRotation = quaternionForRotation;
function multiplyQuaternion(q1, q2) {
    const a = q1[0], b = q1[1], c = q1[2], d = q1[3], e = q2[0], f = q2[1], g = q2[2], h = q2[3];
    return [
        a * e - b * f - c * g - d * h,
        b * e + a * f + c * h - d * g,
        a * g - b * h + c * e + d * f,
        a * h + b * g - c * f + d * e,
    ];
}
exports.multiplyQuaternion = multiplyQuaternion;
