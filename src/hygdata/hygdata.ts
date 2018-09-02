import { parse } from 'papaparse';
import { Feature, Point } from 'geojson';
import { mkParsec } from '../measures/parsec';
import { toApparentMagnitude } from './hygdata.utils';
import { flatMap, map, Validated } from '../utils/validated';
import { mkLatitude, mkRightAscension, decRaToGeo } from '../geometry/coordinates';

export type HygProperty = { magnitude: number; name: string };

export function convertToGeoJson(csv: string): Validated<GeoJSON.FeatureCollection<Point, HygProperty>> {
  const parsed = parse(csv);
  const headers = parsed.data[0];

  const properIndex = headers.indexOf('proper');
  const absmagIndex = headers.indexOf('absmag');
  const distIndex = headers.indexOf('dist');
  const raIndex = headers.indexOf('ra');
  const decIndex = headers.indexOf('dec');

  const maybeFeatures = parsed.data
    .slice(1)
    .reduce((maybeAcc: Validated<Array<Feature<Point, HygProperty>>>, r: Array<string>): Validated<
      Array<Feature<Point, HygProperty>>
    > => {
      const absMag = parseFloat(r[absmagIndex]);
      const maybeDist = mkParsec(parseFloat(r[distIndex]));

      return flatMap(maybeDist, (dist) => {
        const apparentMagnitude = toApparentMagnitude(dist, absMag);

        const name = r[properIndex];
        if (apparentMagnitude > 6 || !name || name.trim() === '') {
          return maybeAcc;
        } else {
          const maybeRa = mkRightAscension(parseFloat(r[raIndex]));
          const maybeDec = mkLatitude(parseFloat(r[decIndex]));

          return flatMap(maybeAcc, (acc) => {
            return flatMap(maybeRa, (ra) => {
              return flatMap(maybeDec, (dec) => {
                const maybeCoordinates = decRaToGeo([dec, ra]);
                return flatMap(maybeCoordinates, (coordinates) => {
                  acc.push({
                    id: name + Math.random(),
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: coordinates },
                    properties: { magnitude: toApparentMagnitude(dist, absMag), name: name },
                  });

                  return acc;
                });
              });
            });
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
