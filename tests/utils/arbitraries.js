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
const color = fc
    .float(0, 255)
    .chain((red) => fc.float(0, 255).chain((green) => fc.float(0, 255).map((blue) => [red, green, blue])));
const vector3d = fc
    .float()
    .chain((red) => fc.float().chain((green) => fc.float().map((blue) => [red, green, blue])));
const orNull = (arb) => fc.oneof(arb, fc.constant(null));
const stars = fc.string().chain((id) => {
    return fc.string().chain((name) => {
        return parsec.chain((distance) => {
            return fc.float().chain((apparentMagnitude) => {
                return color.chain((color) => {
                    return orNull(parsec).chain((radius) => {
                        return fc.string().chain((constellation) => {
                            return orNull(fc.string()).chain((bayer) => {
                                return orNull(fc.string()).chain((flamsteed) => {
                                    return vector3d.map((coordinates) => ({
                                        id,
                                        name,
                                        distance,
                                        apparentMagnitude,
                                        color,
                                        radius,
                                        constellation,
                                        bayer,
                                        flamsteed,
                                        coordinates,
                                    }));
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
exports.arbitray = {
    degree,
    latitude,
    longitude,
    parsec,
    stars,
};
