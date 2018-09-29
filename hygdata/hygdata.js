"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const coordinates_1 = require("../geometry/coordinates");
function convertToGeoJson(json) {
    const entries = Object.entries(json);
    const features = [];
    entries.forEach(([id, star]) => {
        const coordinates = coordinates_1.xyzToLonLat(star.coordinates);
        if (!validated_1.isError(coordinates)) {
            features.push({
                id: id,
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                properties: star,
            });
        }
    });
    return {
        type: 'FeatureCollection',
        features,
    };
}
exports.convertToGeoJson = convertToGeoJson;
