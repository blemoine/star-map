"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const constellations_helpers_1 = require("./constellations.helpers");
const file_helper_1 = require("./file.helper");
const hyg_csv_helpers_1 = require("./hyg-csv.helpers");
const hygDataCsvFileName = process.argv[2];
if (!hygDataCsvFileName) {
    console.error('The first argument must be a valid csv filename');
    process.exit(1);
}
const constallationJsonFileName = process.argv[3];
if (!constallationJsonFileName) {
    console.error('The second argument must be a valid constellation.json filename');
    process.exit(1);
}
const maxNavigationRadius = 110;
Promise.all([file_helper_1.readFile(hygDataCsvFileName), file_helper_1.readFile(constallationJsonFileName)])
    .then(([rawCsvFileContent, rawConstellationJsonFileContent]) => {
    const parsed = file_helper_1.parseToCsv(rawCsvFileContent);
    const maybeFilteredStars = validated_1.flatMap(parsed, (row) => hyg_csv_helpers_1.rowsToStars(maxNavigationRadius, row));
    const maybeParsedConstellation = file_helper_1.parseJson(rawConstellationJsonFileContent, constellations_helpers_1.validateConstellationJson);
    const result = validated_1.flatMap(validated_1.zip(maybeFilteredStars, maybeParsedConstellation), ([filteredStars, parsedConstellation]) => {
        const maybeConstellations = validated_1.sequence(parsedConstellation.map((constellation) => constellations_helpers_1.constellationAsStarId(filteredStars, constellation)));
        return validated_1.map(maybeConstellations, (constellations) => ({
            stars: filteredStars,
            constellations: constellations,
        }));
    });
    if (validated_1.isError(result)) {
        return Promise.reject(result);
    }
    else {
        return result;
    }
})
    .then((r) => {
    console.log(JSON.stringify(r, null, 2));
})
    .catch((error) => {
    console.error('An error happenened', error);
});
