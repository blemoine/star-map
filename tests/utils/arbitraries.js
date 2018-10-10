"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fc = __importStar(require("fast-check"));
const euler_angle_1 = require("../../geometry/euler-angle");
const coordinates_1 = require("../../geometry/coordinates");
const utils_1 = require("./utils");
const parsec_1 = require("../../measures/parsec");
const degree = fc.float().map(euler_angle_1.mkDegree);
const longitude = fc.float(-179.999, 180).map((i) => utils_1.getOrThrow(coordinates_1.mkLongitude(i)));
const latitude = fc.float(-90, 90).map((i) => utils_1.getOrThrow(coordinates_1.mkLatitude(i)));
const parsec = fc.float(1, 1000000).map((i) => utils_1.getOrThrow(parsec_1.mkParsec(i)));
exports.arbitray = {
    degree,
    latitude,
    longitude,
    parsec,
};
