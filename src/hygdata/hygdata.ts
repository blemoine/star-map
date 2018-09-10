import { Feature, Point } from 'geojson';
import { mkParsec } from '../measures/parsec';
import { errorMap, flatMap, map, raise, Validated, zip4, zip6 } from '../utils/validated';
import { decRaToGeo, mkLatitude, mkRightAscension } from '../geometry/coordinates';
import { Star } from './hygdata.utils';

const indexOfHeader = (headers: Array<string>) => (needle: string): Validated<number> => {
  const result = headers.indexOf(needle);
  if (result < 0) {
    return raise(`${needle} header was not found in the list of headers`);
  } else {
    return result;
  }
};

function parseToFloat(n: string): Validated<number> {
  const result = parseFloat(n);
  if (Number.isFinite(result)) {
    return result;
  } else {
    return raise(`Cannot parse ${n} to number`);
  }
}

export function convertToGeoJson(csv: Array<Array<string>>): Validated<GeoJSON.FeatureCollection<Point, Star>> {
  const headers = csv[0];
  const indexOf = indexOfHeader(headers);

  return flatMap(
    zip6(indexOf('proper'), indexOf('mag'), indexOf('dist'), indexOf('ra'), indexOf('dec'), indexOf('id')),
    ([properIndex, magIndex, distIndex, raIndex, decIndex, idIndex]) => {
      const maybeFeatures = csv.reduce(
        (
          maybeAcc: Validated<Array<Feature<Point, Star>>>,
          row: Array<string>,
          rowIndex: number
        ): Validated<Array<Feature<Point, Star>>> => {
          if (rowIndex === 0) {
            return maybeAcc;
          }
          if (row.every((f) => f.trim() === '')) {
            return maybeAcc;
          }
          const maybeMag = parseToFloat(row[magIndex]);
          const maybeDist = flatMap(parseToFloat(row[distIndex]), mkParsec);

          const result = flatMap(maybeMag, (apparentMagnitude) => {
            const name = row[properIndex];

            const maybeRa = flatMap(parseToFloat(row[raIndex]), mkRightAscension);
            const maybeDec = flatMap(parseToFloat(row[decIndex]), mkLatitude);

            return map(zip4(maybeAcc, maybeDec, maybeRa, maybeDist), ([acc, dec, ra, distance]) => {
              const id = row[idIndex];
              return map(decRaToGeo([dec, ra]), (coordinates) => {
                acc.push({
                  id: id,
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                  properties: { apparentMagnitude, name, distance, ra, dec },
                });

                return acc;
              });
            });
          });

          return errorMap(result, (e) => {
            return {
              ...e,
              context: {
                ...e.context,
                rowIndex,
                rowValue: row,
              },
            };
          });
        },
        []
      );

      return map(
        maybeFeatures,
        (features): GeoJSON.FeatureCollection<Point, Star> => {
          return {
            type: 'FeatureCollection',
            features,
          };
        }
      );
    }
  );
}
