import * as React from 'react';
import { StarMap } from '../map/star-map';
import { Point } from 'geojson';
import { convertToGeoJson, HygProperty } from '../hygdata/hygdata';
import { parse } from 'papaparse';
import { isError } from '../utils/validated';

export class App extends React.Component<{}, { geoJson: GeoJSON.FeatureCollection<Point, HygProperty> | null }> {
  state = {
    geoJson: null,
  };

  componentDidMount() {
    fetch('data/hygdata_v3.csv')
      .then((r) => r.text())
      .then((rawCsv) => {
        const parsed = parse(rawCsv);
        if (parsed.errors.length > 0) {
          /*
          TODO display errors ?
          const [headError, ...tailErrors] = parsed.errors;

          const baseErr = raise(headError.message, headError);
          return tailErrors.reduce((err, e) => err.combine(raise(e.message, e)), baseErr);
          */
          console.error(parsed.errors);
        }
        const csv = parsed.data;
        const geoJson = convertToGeoJson(csv, (magnitude: number) => magnitude < 6);
        if (isError(geoJson)) {
          console.error(...geoJson.errors());
        } else {
          this.setState((prevState) => ({ ...prevState, geoJson }));
        }
      });
  }

  render() {
    const geoJson = this.state.geoJson;

    return (
      <>
        <div className="main-wrapper">
          {geoJson ? <StarMap geoJson={geoJson} width="100vw" height="100vh" /> : 'LOADING...'}
        </div>
      </>
    );
  }
}
