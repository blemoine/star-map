import { Feature, Point } from 'geojson';
import { mkParsec } from '../measures/parsec';
import { toApparentMagnitude } from './hygdata.utils';
import { errorMap, flatMap, map, raise, Validated, zip, zip6 } from '../utils/validated';
import { decRaToGeo, mkLatitude, mkRightAscension } from '../geometry/coordinates';

export type HygProperty = { magnitude: number; name: string };

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

export function convertToGeoJson(
  csv: Array<Array<string>>,
  shouldDisplay: (magnitude: number) => boolean
): Validated<GeoJSON.FeatureCollection<Point, HygProperty>> {
  const headers = csv[0];
  const indexOf = indexOfHeader(headers);

  return flatMap(
    zip6(indexOf('proper'), indexOf('absmag'), indexOf('dist'), indexOf('ra'), indexOf('dec'), indexOf('id')),
    ([properIndex, absmagIndex, distIndex, raIndex, decIndex, idIndex]) => {
      const maybeFeatures = csv.reduce(
        (
          maybeAcc: Validated<Array<Feature<Point, HygProperty>>>,
          row: Array<string>,
          rowIndex: number
        ): Validated<Array<Feature<Point, HygProperty>>> => {
          if (rowIndex === 0) {
            return maybeAcc;
          }
          if (row.every((f) => f.trim() === '')) {
            return maybeAcc;
          }
          const maybeAbsMag = parseToFloat(row[absmagIndex]);
          const maybeDist = flatMap(parseToFloat(row[distIndex]), mkParsec);

          const result = flatMap(zip(maybeDist, maybeAbsMag), ([dist, absMag]) => {
            const apparentMagnitude = toApparentMagnitude(dist, absMag);

            const name = row[properIndex];
            if (!shouldDisplay(apparentMagnitude)) {
              return maybeAcc;
            } else {
              const maybeRa = flatMap(parseToFloat(row[raIndex]), mkRightAscension);
              const maybeDec = flatMap(parseToFloat(row[decIndex]), mkLatitude);

              const maybeCoordinates = map(zip(maybeDec, maybeRa), decRaToGeo);

              return map(zip(maybeAcc, maybeCoordinates), ([acc, coordinates]) => {
                const id = row[idIndex];
                acc.push({
                  id: id,
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                  properties: { magnitude: toApparentMagnitude(dist, absMag), name: name },
                });

                return acc;
              });
            }
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
        (features): GeoJSON.FeatureCollection<Point, HygProperty> => {
          return {
            type: 'FeatureCollection',
            features,
          };
        }
      );
    }
  );
}
