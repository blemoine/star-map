"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
const parsec_1 = require("../measures/parsec");
const number_1 = require("../utils/number");
const spectral_types_informations_1 = require("../data/spectral-types-informations");
const stars_utils_1 = require("../stars/stars.utils");
const constellations_helpers_1 = require("./constellations.helpers");
function rowsToStars(maxNavigationRadius, rows) {
    return rows.reduce((maybeAcc, row) => {
        return validated_1.flatMap(maybeAcc, (acc) => {
            return validated_1.map(rowToStar(row), (star) => {
                if (star.distance > maxNavigationRadius) {
                    const newD = parsec_1.mkParsec(star.distance - maxNavigationRadius);
                    if (!validated_1.isError(newD) && hygdata_utils_1.magnitudeAt(star.apparentMagnitude, star.distance, newD) > 6) {
                        return acc;
                    }
                }
                acc.push(star);
                return acc;
            });
        });
    }, []);
}
exports.rowsToStars = rowsToStars;
function rowToStar(row) {
    const maybeDistance = validated_1.flatMap(number_1.parseToFloat(row.dist), parsec_1.mkParsec);
    const maybeApparentMagnitude = number_1.parseToFloat(row.mag);
    const spectralType = row.spect;
    const color = spectral_types_informations_1.findColorOf(spectralType);
    const temperature = spectral_types_informations_1.findTemperatureOf(spectralType);
    const maybeCoordinates = validated_1.zip3(number_1.parseToFloat(row.x), number_1.parseToFloat(row.y), number_1.parseToFloat(row.z));
    return validated_1.flatMap(validated_1.zip3(maybeDistance, maybeApparentMagnitude, maybeCoordinates), function ([distance, apparentMagnitude, coordinates,]) {
        const maybeRadius = temperature
            ? stars_utils_1.computeRadius(temperature, hygdata_utils_1.toAbsoluteMagnitude(apparentMagnitude, distance))
            : null;
        return validated_1.map(maybeRadius, function (radius) {
            return {
                id: row.id,
                name: row.proper,
                bayer: constellations_helpers_1.convertStarNameToFullName(row.bayer),
                flamsteed: row.flam,
                constellation: row.con.toLowerCase(),
                color: color,
                distance: distance,
                apparentMagnitude: apparentMagnitude,
                radius: radius,
                coordinates: coordinates,
            };
        });
    });
}
