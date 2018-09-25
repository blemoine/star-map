import { LineString, Point, Position } from 'geojson';
import { Star } from '../hygdata/hygdata.utils';

export const emptyConstellations: GeoJSON.FeatureCollection<LineString, {}> = {
  type: 'FeatureCollection',
  features: [],
};

export function convertConstellationToGeoJson(
  constellations: Array<Array<string>>,
  starsGeoJson: GeoJSON.FeatureCollection<Point, Star>
): GeoJSON.FeatureCollection<LineString, {}> {
  const features: Array<GeoJSON.Feature<LineString, {}>> = constellations.map(
    (constellation): GeoJSON.Feature<LineString, {}> => {
      const coordinates: Array<Position> = constellation
        .map((id) => {
          const star = starsGeoJson.features.find((feature) => feature.properties.id === id);
          if (star) {
            return star.geometry.coordinates;
          } else {
            return null;
          }
        })
        .filter((x): x is Position => x !== null);

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {},
      };
    }
  );

  return { type: 'FeatureCollection', features };
}
