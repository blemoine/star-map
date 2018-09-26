import { flatMap, isError, map, Validated, zip3 } from '../utils/validated';
import { magnitudeAt, Star, toAbsoluteMagnitude } from '../hygdata/hygdata.utils';
import { mkParsec } from '../measures/parsec';
import { parseToFloat } from '../utils/number';
import { findColorOf, findTemperatureOf } from '../data/spectral-types-informations';
import { computeRadius } from '../stars/stars.utils';
import { convertStarNameToFullName } from './constellations.helpers';

export type RawHygCsvRow = {
  id: string;
  proper: string;
  ra: string;
  dec: string;
  dist: string;
  mag: string;
  spect: string;
  x: string;
  y: string;
  z: string;
  bayer: string;
  flam: string;
  con: string;
};

export function rowsToStars(
  maxNavigationRadius: number,
  rows: Array<RawHygCsvRow>
): Validated<{ [key: string]: Star }> {
  return rows.reduce((maybeAcc: Validated<{ [starId: string]: Star }>, row) => {
    return flatMap(maybeAcc, (acc) => {
      return map(rowToStar(row), (star) => {
        if (star.distance > maxNavigationRadius) {
          const newD = mkParsec(star.distance - maxNavigationRadius);
          if (!isError(newD) && magnitudeAt(star.apparentMagnitude, star.distance, newD) > 6) {
            return acc;
          }
        }
        acc[star.id] = star;

        return acc;
      });
    });
  }, {});
}

function rowToStar(row: RawHygCsvRow): Validated<Star> {
  const maybeDistance = flatMap(parseToFloat(row.dist), mkParsec);
  const maybeApparentMagnitude = parseToFloat(row.mag);

  const spectralType = row.spect;
  const color = findColorOf(spectralType);
  const temperature = findTemperatureOf(spectralType);

  const maybeCoordinates = zip3(parseToFloat(row.x), parseToFloat(row.y), parseToFloat(row.z));

  return flatMap(zip3(maybeDistance, maybeApparentMagnitude, maybeCoordinates), function([
    distance,
    apparentMagnitude,
    coordinates,
  ]) {
    const maybeRadius = temperature
      ? computeRadius(temperature, toAbsoluteMagnitude(apparentMagnitude, distance))
      : null;
    return map(maybeRadius, function(radius) {
      return {
        id: row.id,
        name: row.proper,
        bayer: convertStarNameToFullName(row.bayer),
        flamsteed: row.flam,
        constellation: row.con.toLowerCase(),
        color: color,
        distance: distance,
        apparentMagnitude: apparentMagnitude,
        radius: radius,
        coordinates: coordinates,
      };
    });
  });
}
