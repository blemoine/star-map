import { LineString, Point, Position } from 'geojson';
import { Star } from '../hygdata/hygdata.utils';

export function convertConstellationToGeoJson(
  constellations: Array<Array<[string, string]>>,
  starsGeoJson: GeoJSON.FeatureCollection<Point, Star>
): GeoJSON.FeatureCollection<LineString, {}> {
  const features: Array<GeoJSON.Feature<LineString, {}>> = constellations.map(
    (constellation): GeoJSON.Feature<LineString, {}> => {
      const coordinates: Array<Position> = constellation
        .map(([con, bayer]) => {
          const bayerLower = bayer.toLowerCase();
          const conLower = con.toLowerCase();
          const star = starsGeoJson.features.find((f) => {
            if (!f.properties.bayer) {
              return false;
            }

            return (
              f.properties.constellation === conLower &&
              (bayerLower.startsWith(f.properties.bayer) || f.properties.bayer.startsWith(bayerLower.substr(0, 3)))
            );
          });
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
