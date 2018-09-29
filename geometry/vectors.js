"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cross(v0, v1) {
    return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}
exports.cross = cross;
function dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}
exports.dot = dot;
function vectorLength(v) {
    return Math.sqrt(dot(v, v));
}
exports.vectorLength = vectorLength;
