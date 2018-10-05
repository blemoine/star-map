"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const star_map_1 = require("./star-map");
const React = __importStar(require("react"));
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
const constellations_1 = require("../constellations/constellations");
const reduce_1 = __importDefault(require("lodash/reduce"));
const validated_1 = require("../utils/validated");
const coordinates_1 = require("../geometry/coordinates");
let starCache = {};
let constellationCache = {};
let currTimeout = null;
function asyncSearchNearestStar(features, cb) {
    if (currTimeout !== null) {
        clearTimeout(currTimeout);
    }
    _searchNearestStar(0, null);
    function _searchNearestStar(idx, currStar) {
        currTimeout = setTimeout(() => {
            if (idx === features.length - 1) {
                cb(currStar);
            }
            const newStar = features[idx];
            const newMin = !!newStar && (currStar === null || currStar.distance > newStar.properties.distance)
                ? newStar.properties
                : currStar;
            _searchNearestStar(idx + 1, newMin);
        });
    }
}
exports.StarMapContainer = (props) => {
    let geoJson;
    const starId = props.starDictionnary.id + '-' + props.maxMagnitude + '-' + props.position;
    if (starCache[starId]) {
        geoJson = starCache[starId];
    }
    else {
        geoJson = computeGeoJson(props.starDictionnary.stars, props.maxMagnitude, props.position);
        props.updateNearestStar(null);
        asyncSearchNearestStar(geoJson.features, (star) => {
            props.updateNearestStar(star);
        });
        starCache = { [starId]: geoJson };
    }
    let constellation;
    const constellationId = props.starDictionnary.id + '-' + props.position + '-' + props.constellations.id + '-' + props.displayConstellation;
    if (constellationCache[constellationId]) {
        constellation = constellationCache[constellationId];
    }
    else {
        constellation = props.displayConstellation
            ? constellations_1.convertConstellationToGeoJson(props.constellations.constellations, props.starDictionnary.stars, props.position)
            : constellations_1.emptyConstellations;
        constellationCache = { [constellationId]: constellation };
    }
    return (React.createElement(star_map_1.StarMap, { constellation: constellation, geoJson: geoJson, rotation: props.rotation, rotationChange: (rotation) => props.updateRotation(rotation) }));
};
function computeGeoJson(stars, maxMagnitude, position) {
    return {
        type: 'FeatureCollection',
        features: reduce_1.default(stars, (acc, oldStar) => {
            const newStar = hygdata_utils_1.moveOrigin(position, oldStar);
            if (validated_1.isError(newStar)) {
                console.error(newStar.errors());
                return acc;
            }
            else {
                if (newStar.apparentMagnitude > maxMagnitude) {
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
