import { flatMap, isError, map, sequence, Validated, zip } from '../utils/validated';
import { constellationAsStarId, optimizeConstellation, validateConstellationJson } from './constellations.helpers';
import { parseJson, parseToCsv, readFile } from './file.helper';
import { RawHygCsvRow, rowsToStars } from './hyg-csv.helpers';
import { StarInterchangeFormat, starToInterchange } from '../hygdata/hygdata.utils';

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

export type PreComputationResult = { stars: Array<StarInterchangeFormat>; constellations: Array<Array<string>> };

const maxNavigationRadius = 110;

Promise.all([readFile(hygDataCsvFileName), readFile(constallationJsonFileName)])
  .then(([rawCsvFileContent, rawConstellationJsonFileContent]) => {
    const parsed = parseToCsv<RawHygCsvRow>(rawCsvFileContent);
    const maybeFilteredStars = flatMap(parsed, (row) => rowsToStars(maxNavigationRadius, row));
    const maybeParsedConstellation = parseJson(rawConstellationJsonFileContent, validateConstellationJson);

    const result = flatMap(
      zip(maybeFilteredStars, maybeParsedConstellation),
      ([filteredStars, parsedConstellation]): Validated<PreComputationResult> => {
        const optimizedConstellations = optimizeConstellation(parsedConstellation);

        const maybeConstellations = sequence(
          optimizedConstellations.map((constellation) => constellationAsStarId(filteredStars, constellation))
        );

        return map(maybeConstellations, (constellations) => ({
          stars: filteredStars.map(starToInterchange),
          constellations: constellations,
        }));
      }
    );

    if (isError(result)) {
      return Promise.reject<any>(result);
    } else {
      return result;
    }
  })
  .then((r: PreComputationResult) => {
    console.log(JSON.stringify(r));
  })
  .catch((error) => {
    console.error('An error happenened', error);
  });
