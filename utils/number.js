"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("./validated");
exports.round = (num, precision = 2) => {
    const exp = Math.pow(10, precision);
    return Math.round(num * exp) / exp;
};
const pi_2 = Math.PI / 2;
//http://developer.download.nvidia.com/cg/atan2.html
function fastAtan2(y, x) {
    if (x === 0 && y === 0)
        return 0;
    let t0, t1, t3, t4;
    t3 = Math.abs(x);
    t1 = Math.abs(y);
    t0 = Math.max(t3, t1);
    t1 = Math.min(t3, t1);
    t3 = 1 / t0;
    t3 = t1 * t3;
    t4 = t3 * t3;
    t0 = -0.01348047;
    t0 = t0 * t4 + 0.057477314;
    t0 = t0 * t4 - 0.121239071;
    t0 = t0 * t4 + 0.195635925;
    t0 = t0 * t4 - 0.332994597;
    t0 = t0 * t4 + 0.99999563;
    t3 = t0 * t3;
    t3 = Math.abs(y) > Math.abs(x) ? 1.570796327 - t3 : t3;
    t3 = x < 0 ? 3.141592654 - t3 : t3;
    t3 = y < 0 ? -t3 : t3;
    const result = t3;
    if (result < -Math.PI) {
        return -Math.PI;
    }
    else if (result > Math.PI) {
        return Math.PI;
    }
    else {
        return result;
    }
}
exports.fastAtan2 = fastAtan2;
function fastAsin(a) {
    const result = fastAtan2(a, Math.sqrt(1 - a * a));
    if (result < -pi_2) {
        return -pi_2;
    }
    else if (result > pi_2) {
        return pi_2;
    }
    else {
        return result;
    }
}
exports.fastAsin = fastAsin;
function parseToFloat(n) {
    const result = parseFloat(n);
    if (Number.isFinite(result)) {
        return result;
    }
    else {
        return validated_1.raise(`Cannot parse ${n} to number`);
    }
}
exports.parseToFloat = parseToFloat;
