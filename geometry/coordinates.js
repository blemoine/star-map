"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const vectors_1 = require("./vectors");
const euler_angle_1 = require("./euler-angle");
const number_1 = require("../utils/number");
function mkLatitude(n) {
    if (n < -90 || n > 90) {
        return validated_1.raise(`The latitude ${n} should be between -90 and 90`);
    }
    else {
        return n;
    }
}
exports.mkLatitude = mkLatitude;
function mkLongitude(n) {
    if (n < -180 || n > 180) {
        return validated_1.raise(`The longitude ${n} should be between -180 and 180`);
    }
    else {
        return n;
    }
}
exports.mkLongitude = mkLongitude;
function lonlat2xyz(coord) {
    const lon = euler_angle_1.toRadians(coord[0]);
    const lat = euler_angle_1.toRadians(coord[1]);
    const x = Math.cos(lat) * Math.cos(lon);
    const y = Math.cos(lat) * Math.sin(lon);
    const z = Math.sin(lat);
    return [x, y, z];
}
exports.lonlat2xyz = lonlat2xyz;
function xyzToLonLat(v) {
    const [x, y, z] = v;
    const dist = vectors_1.vectorLength(v);
    return validated_1.flatMap(validated_1.zip(euler_angle_1.mkRadian(number_1.fastAsin(z / dist)), euler_angle_1.mkRadian(number_1.fastAtan2(y, x))), ([asin, atan]) => {
        const lat = mkLatitude(euler_angle_1.toDegree(asin));
        const lon = mkLongitude(euler_angle_1.toDegree(atan));
        return validated_1.zip(lon, lat);
    });
}
exports.xyzToLonLat = xyzToLonLat;
