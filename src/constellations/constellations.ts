import { map, raise, sequence, Validated } from '../utils/validated';
import { Feature, LineString, Point, Position } from 'geojson';
import { Star } from '../hygdata/hygdata.utils';

export function convertConstellationToGeoJson(
  constellations: Array<Array<[string, string]>>,
  starsGeoJson: GeoJSON.FeatureCollection<Point, Star>
): Validated<GeoJSON.FeatureCollection<LineString, {}>> {
  const maybeFeatures = sequence(
    constellations.map((constellation) => {
      const maybeGeometry: Validated<Array<Position>> = sequence(
        constellation.map(([con, bayer]) => {
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
            return raise(`Count not find a star for constellation ${con} and  bayer '${bayer}'`);
          }
        })
      );

      return map(
        maybeGeometry,
        (geometry): Feature<LineString, {}> => {
          return {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: geometry,
            },
            properties: {},
          };
        }
      );
    })
  );
  return map(
    maybeFeatures,
    (features): GeoJSON.FeatureCollection<LineString, {}> => ({ type: 'FeatureCollection', features })
  );
}
