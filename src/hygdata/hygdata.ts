import { parse } from 'papaparse';
import { Feature, Point } from 'geojson';
import { mkParsec } from '../measures/parsec';
import { toApparentMagnitude } from './hygdata.utils';
import { flatMap, map, raise, Validated, zip, zip6 } from '../utils/validated';
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

export function convertToGeoJson(csv: string): Validated<GeoJSON.FeatureCollection<Point, HygProperty>> {
  const parsed = parse(csv);
  if (parsed.errors.length > 0) {
    return raise(parsed.errors.map((e) => e.message).join(', '));
  }
  const headers = parsed.data[0];
  const indexOf = indexOfHeader(headers);

  return flatMap(
    zip6(indexOf('proper'), indexOf('absmag'), indexOf('dist'), indexOf('ra'), indexOf('dec'), indexOf('id')),
    ([properIndex, absmagIndex, distIndex, raIndex, decIndex, idIndex]) => {
      const maybeFeatures = parsed.data
        .slice(1)
        .reduce((maybeAcc: Validated<Array<Feature<Point, HygProperty>>>, r: Array<string>): Validated<
          Array<Feature<Point, HygProperty>>
        > => {
          const maybeAbsMag = parseToFloat(r[absmagIndex]);
          const maybeDist = flatMap(parseToFloat(r[distIndex]), mkParsec);

          return flatMap(zip(maybeDist, maybeAbsMag), ([dist, absMag]) => {
            const apparentMagnitude = toApparentMagnitude(dist, absMag);

            const name = r[properIndex];
            if (apparentMagnitude > 6 || !name || name.trim() === '') {
              return maybeAcc;
            } else {
              const maybeRa = flatMap(parseToFloat(r[raIndex]), mkRightAscension);
              const maybeDec = flatMap(parseToFloat(r[decIndex]), mkLatitude);

              const maybeCoordinates = map(zip(maybeDec, maybeRa), decRaToGeo);

              return map(zip(maybeAcc, maybeCoordinates), ([acc, coordinates]) => {
                const id = r[idIndex];
                acc.push({
                  id: id,
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: coordinates },
                  properties: { magnitude: toApparentMagnitude(dist, absMag), name: name },
                });

                return acc;
              });
            }
          });
        }, []);

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
