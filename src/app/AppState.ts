import { Point } from 'geojson';
import { Star } from '../hygdata/hygdata.utils';
import { Rotation } from '../geometry/rotation';
import { Vector3D } from '../geometry/vectors';

export type AppState = {
  baseGeoJson: GeoJSON.FeatureCollection<Point, Star> | null;
  maxMagnitude: number;
  rotation: Rotation;
  position: Vector3D;
};