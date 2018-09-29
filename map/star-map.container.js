"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const star_map_1 = require("./star-map");
const React = __importStar(require("react"));
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
const constellations_1 = require("../constellations/constellations");
const lodash_1 = require("lodash");
const validated_1 = require("../utils/validated");
const coordinates_1 = require("../geometry/coordinates");
let starCache = {};
let constellationCache = {};
exports.StarMapContainer = (props) => {
    let geoJson;
    const starId = props.starDictionnary.id + '-' + props.maxMagnitude + '-' + props.position;
    if (starCache[starId]) {
        geoJson = starCache[starId];
    }
    else {
        const mandatoryStars = new Set(lodash_1.flatten(props.constellations.constellations));
        geoJson = computeGeoJson(props.starDictionnary.stars, mandatoryStars, props.maxMagnitude, props.position);
        starCache = { [starId]: geoJson };
    }
    let constellation;
    const constellationId = starId + '-' + props.constellations.id + '-' + props.displayConstellation;
    if (constellationCache[constellationId]) {
        constellation = constellationCache[constellationId];
    }
    else {
        constellation = props.displayConstellation
            ? constellations_1.convertConstellationToGeoJson(props.constellations.constellations, geoJson)
            : constellations_1.emptyConstellations;
        constellationCache = { [constellationId]: constellation };
    }
    return (React.createElement(star_map_1.StarMap, { constellation: constellation, geoJson: geoJson, rotation: props.rotation, rotationChange: (rotation) => props.updateRotation(rotation) }));
};
function computeGeoJson(stars, mandatoryStars, maxMagnitude, position) {
    return {
        type: 'FeatureCollection',
        features: lodash_1.reduce(stars, (acc, oldStar) => {
            const newStar = hygdata_utils_1.moveOrigin(position, oldStar);
            if (validated_1.isError(newStar)) {
                console.error(newStar.errors());
                return acc;
            }
            else {
                const isMandatoryStar = mandatoryStars.has(newStar.id);
                if (newStar.apparentMagnitude > maxMagnitude && !isMandatoryStar) {
                    return acc;
                }
                else {
                    const coordinates = coordinates_1.xyzToLonLat(newStar.coordinates);
                    if (validated_1.isError(coordinates)) {
                        console.error(newStar, coordinates.errors());
                        return acc;
                    }
                    else {
                        const newValue = {
                            id: oldStar.id,
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                            properties: newStar,
                        };
                        acc.push(newValue);
                        return acc;
                    }
                }
            }
        }, []),
    };
}
