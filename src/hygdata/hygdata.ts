import { Feature, Point } from 'geojson';
import { mkParsec, Parsec } from '../measures/parsec';
import { moveOrigin } from './hygdata.utils';
import { errorMap, flatMap, map, raise, Validated, zip, zip3, zip6 } from '../utils/validated';
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
  moveTo: {
    x: Parsec;
    y: Parsec;
    z: Parsec;
  },
  shouldDisplay: (magnitude: number) => boolean
): Validated<GeoJSON.FeatureCollection<Point, HygProperty>> {
  const headers = csv[0];
  const indexOf = indexOfHeader(headers);

  return flatMap(
    zip6(indexOf('proper'), indexOf('mag'), indexOf('dist'), indexOf('ra'), indexOf('dec'), indexOf('id')),
    ([properIndex, magIndex, distIndex, raIndex, decIndex, idIndex]) => {
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
          const maybeMag = parseToFloat(row[magIndex]);
          const maybeDist = flatMap(parseToFloat(row[distIndex]), mkParsec);

          const result = flatMap(maybeMag, (apparentMagnitude) => {
            const name = row[properIndex];

            const maybeRa = flatMap(parseToFloat(row[raIndex]), mkRightAscension);
            const maybeDec = flatMap(parseToFloat(row[decIndex]), mkLatitude);

            const newStar = map(zip3(maybeDec, maybeRa, maybeDist), ([dec, ra, distance]) => {
              return moveOrigin(moveTo, {
                ra,
                dec,
                distance,
                apparentMagnitude,
              });
            });

            return map(zip(maybeAcc, newStar), ([acc, star]) => {
              if (!shouldDisplay(star.apparentMagnitude)) {
                return acc;
              } else {
                const id = row[idIndex];
                return map(decRaToGeo([star.dec, star.ra]), (coordinates) => {
                  acc.push({
                    id: id,
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                    properties: { magnitude: star.apparentMagnitude, name: name },
                  });

                  return acc;
                });
              }
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
