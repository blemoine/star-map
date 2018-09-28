import { flatMap, isError, map, sequence, Validated, zip } from '../utils/validated';
import { constellationAsStarId, validateConstellationJson } from './constellations.helpers';
import { parseJson, parseToCsv, readFile } from './file.helper';
import { RawHygCsvRow, rowsToStars } from './hyg-csv.helpers';
import { StarDictionnary } from '../app/AppState';

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

type Result = { stars: StarDictionnary; constellations: Array<Array<string>> };

const maxNavigationRadius = 100;

Promise.all([readFile(hygDataCsvFileName), readFile(constallationJsonFileName)])
  .then(([rawCsvFileContent, rawConstellationJsonFileContent]) => {
    const parsed = parseToCsv<RawHygCsvRow>(rawCsvFileContent);
    const maybeFilteredStars = flatMap(parsed, (row) => rowsToStars(maxNavigationRadius, row));
    const maybeParsedConstellation = parseJson(rawConstellationJsonFileContent, validateConstellationJson);

    const result = flatMap(
      zip(maybeFilteredStars, maybeParsedConstellation),
      ([filteredStars, parsedConstellation]): Validated<Result> => {
        const maybeConstellations = sequence(
          parsedConstellation.map((constellation) => constellationAsStarId(filteredStars, constellation))
        );

        return map(maybeConstellations, (constellations) => ({
          stars: filteredStars,
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
  .then((r: Result) => {
    console.log(JSON.stringify(r, null, 2));
  })
  .catch((error) => {
    console.error('An error happenened', error);
  });
