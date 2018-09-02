import { convertToGeoJson } from './hygdata/hygdata';
import { StarMap } from './map/star-map';
import { isError } from './utils/validated';

fetch('data/hygdata_v3.csv')
  .then((r) => r.text())
  .then((csv) => {
    const geoJson = convertToGeoJson(csv);
    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      const starMap = new StarMap(geoJson);

      starMap.render('#main-map');
    }
  });
