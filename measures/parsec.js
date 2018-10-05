"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
function mkParsec(n) {
    if (n < 0) {
        return validated_1.raise(`Cannot transform ${n} to parsec, must be positive`);
    }
    else {
        return n;
    }
}
exports.mkParsec = mkParsec;
function add(p1, p2) {
    const r = mkParsec(p1 + p2);
    if (validated_1.isError(r)) {
        throw new Error(`It cannot happen, as ${p1} and ${p2} are parsec, there sum IS positive`);
    }
    return r;
}
exports.add = add;
function toLightYear(p) {
    return p * 3.261;
}
exports.toLightYear = toLightYear;
function toKm(p) {
    return p * 3.08567758e13;
}
exports.toKm = toKm;
function minParsec(p1, p2) {
    return p1 < p2 ? p1 : p2;
}
exports.minParsec = minParsec;
