import { convertToGeoJson } from './hygdata/hygdata';
import { StarMap } from './map/star-map';
import { isError } from './utils/validated';
import { parse } from 'papaparse';

let csv: Array<Array<string>>;
fetch('data/hygdata_v3.csv')
  .then((r) => r.text())
  .then((rawCsv) => {
    const parsed = parse(rawCsv);
    if (parsed.errors.length > 0) {
      /*
      const [headError, ...tailErrors] = parsed.errors;

      const baseErr = raise(headError.message, headError);
      return tailErrors.reduce((err, e) => err.combine(raise(e.message, e)), baseErr);
      */
      console.error(parsed.errors)
    }
    csv = parsed.data;
    const geoJson = convertToGeoJson(csv, (magnitude: number) => magnitude < 6);
    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      const starMap = new StarMap(geoJson);

      starMap.render('#main-map');
    }
  });

(window as any).updateMaxMagnitude = function(value: number) {
  const geoJson = convertToGeoJson(csv, (magnitude: number) => magnitude < value);
  if (isError(geoJson)) {
    console.error(...geoJson.errors());
  } else {
    const starMap = new StarMap(geoJson);

    starMap.render('#main-map');
  }
};
