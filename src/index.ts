import { convertToGeoJson } from './hygdata/hygdata';
import { StarMap } from './map/star-map';
import { isError } from './utils/validated';

let csv: string;
fetch('data/hygdata_v3.csv')
  .then((r) => r.text())
  .then((rawCsv) => {
    csv = rawCsv;
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
