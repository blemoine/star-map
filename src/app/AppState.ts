import { LineString, Point } from 'geojson';
import { Star } from '../hygdata/hygdata.utils';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';
import { Parsec } from '../measures/parsec';

export type AppState = {
  baseGeoJson: GeoJSON.FeatureCollection<Point, Star> | null;
  baseConstellation: GeoJSON.FeatureCollection<LineString, {}> | null;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
  currentAcceleration: Parsec;
};
