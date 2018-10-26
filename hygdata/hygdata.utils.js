"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsec_1 = require("../measures/parsec");
const validated_1 = require("../utils/validated");
const vectors_1 = require("../geometry/vectors");
const constellations_1 = require("../constellations/constellations");
const number_1 = require("../utils/number");
function interchangeToStar(interchangeFormat) {
    return {
        id: interchangeFormat[0],
        name: interchangeFormat[1],
        distance: interchangeFormat[2],
        apparentMagnitude: interchangeFormat[3],
        color: [interchangeFormat[4], interchangeFormat[5], interchangeFormat[6]],
        radius: interchangeFormat[7],
        constellation: interchangeFormat[8],
        bayer: interchangeFormat[9],
        flamsteed: interchangeFormat[10],
        coordinates: [interchangeFormat[11], interchangeFormat[12], interchangeFormat[13]],
    };
}
exports.interchangeToStar = interchangeToStar;
function starToInterchange(star) {
    return [
        star.id,
        star.name,
        star.distance,
        star.apparentMagnitude,
        star.color[0],
        star.color[1],
        star.color[2],
        star.radius,
        star.constellation,
        star.bayer,
        star.flamsteed,
        star.coordinates[0],
        star.coordinates[1],
        star.coordinates[2],
    ];
}
exports.starToInterchange = starToInterchange;
function magnitudeAt(baseMagnitude, baseDistance, newDistance) {
    return baseMagnitude + 5 * Math.log10(newDistance / baseDistance);
}
exports.magnitudeAt = magnitudeAt;
function toAbsoluteMagnitude(baseMagnitude, baseDistance) {
    return magnitudeAt(baseMagnitude, baseDistance, parsec_1.mkParsec(10));
}
exports.toAbsoluteMagnitude = toAbsoluteMagnitude;
function moveOrigin(newOrigin, star) {
    const coordinates = [
        star.coordinates[0] - newOrigin[0],
        star.coordinates[1] - newOrigin[1],
        star.coordinates[2] - newOrigin[2],
    ];
    const maybeDistance = parsec_1.mkParsec(vectors_1.vectorLength(coordinates));
    const newCoord = validated_1.map(maybeDistance, (distance) => ({
        distance,
        coordinates,
    }));
    return validated_1.map(newCoord, ({ distance, coordinates }) => {
        const apparentMagnitude = magnitudeAt(star.apparentMagnitude, star.distance, distance);
        return {
            id: star.id,
            name: star.name,
            color: star.color,
            radius: star.radius,
            constellation: star.constellation,
            bayer: star.bayer,
            flamsteed: star.flamsteed,
            coordinates,
            distance,
            apparentMagnitude,
        };
    });
}
exports.moveOrigin = moveOrigin;
function formatName(star) {
    return ((star.name ? star.name + ', ' : '') + (star.bayer || star.flamsteed) + ' - ' + constellations_1.toGenitiveName(star.constellation));
}
exports.formatName = formatName;
function formatDistance(star) {
    const distance = star.distance;
    return distance < 10e-5 ? number_1.round(parsec_1.toKm(distance), 3) + 'Km' : number_1.round(parsec_1.toLightYear(distance), 5) + ' Light-years';
}
exports.formatDistance = formatDistance;
