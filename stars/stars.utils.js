"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsec_1 = require("../measures/parsec");
const SunTemp = 5500;
const absoluteMagnitudeSun = 4.85;
const SunRadius = 2.25398792e-8;
function computeRadius(temperature, absoluteMagnitude) {
    return parsec_1.mkParsec(SunRadius *
        Math.pow(SunTemp / temperature, 2) *
        Math.sqrt(Math.pow(2.512, absoluteMagnitudeSun - absoluteMagnitude)));
}
exports.computeRadius = computeRadius;
