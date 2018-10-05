"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsec_1 = require("../measures/parsec");
const validated_1 = require("../utils/validated");
const vectors_1 = require("../geometry/vectors");
const constellations_1 = require("../constellations/constellations");
const number_1 = require("../utils/number");
function magnitudeAt(baseMagnitude, baseDistance, newDistance) {
    return baseMagnitude + 5 * Math.log10(newDistance / baseDistance);
}
exports.magnitudeAt = magnitudeAt;
function toApparentMagnitude(distance, absoluteMagnitude) {
    return magnitudeAt(absoluteMagnitude, parsec_1.mkParsec(10), distance);
}
exports.toApparentMagnitude = toApparentMagnitude;
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
    return (star.name ? star.name + ', ' : '') + (star.bayer || star.flamsteed) + ' - ' + constellations_1.toFullName(star.constellation);
}
exports.formatName = formatName;
function formatDistance(star) {
    const distance = star.distance;
    return distance < 10e-5 ? number_1.round(parsec_1.toKm(distance), 3) + 'Km' : number_1.round(parsec_1.toLightYear(distance), 5) + ' Light-years';
}
exports.formatDistance = formatDistance;
