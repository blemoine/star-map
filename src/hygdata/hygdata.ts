import { Feature, Point } from 'geojson';
import { isError, Validated } from '../utils/validated';
import { xyzToLonLat } from '../geometry/coordinates';
import { Star } from './hygdata.utils';

export function convertToGeoJson(json: { [key: string]: Star }): Validated<GeoJSON.FeatureCollection<Point, Star>> {
  const entries = Object.entries(json);
  const features: Array<Feature<Point, Star>> = [];
  entries.forEach(([id, star]) => {
    const coordinates = xyzToLonLat(star.coordinates);
    if (!isError(coordinates)) {
      features.push({
        id: id,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
        properties: star,
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}
