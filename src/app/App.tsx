import * as React from 'react';
import { StarMap } from '../map/star-map';
import { Point } from 'geojson';
import { convertToGeoJson, HygProperty } from '../hygdata/hygdata';
import { parse } from 'papaparse';
import { isError } from '../utils/validated';
import { Controls } from '../controls/controls';

export class App extends React.Component<{}, { geoJson: GeoJSON.FeatureCollection<Point, HygProperty> | null }> {
  state = {
    geoJson: null,
    maxMagnitude: 6,
  };

  private csv: Array<Array<string>> = [];

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
        this.csv = parsed.data;
        const geoJson = convertToGeoJson(this.csv, (magnitude: number) => magnitude < this.state.maxMagnitude);
        if (isError(geoJson)) {
          console.error(...geoJson.errors());
        } else {
          this.setState((prevState) => ({ ...prevState, geoJson }));
        }
      });
  }

  private updateMagnitude(maxMagnitude: number) {
    this.setState((prevState) => ({ ...prevState, maxMagnitude }));
    const geoJson = convertToGeoJson(this.csv, (magnitude: number) => magnitude < maxMagnitude);
    if (isError(geoJson)) {
      console.error(...geoJson.errors());
    } else {
      this.setState((prevState) => ({ ...prevState, geoJson }));
    }
  }

  render() {
    const geoJson = this.state.geoJson;

    return (
      <>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            minHeight: '50px',
            backgroundColor: 'rgba(55,55,55,0.8)',
          }}
        >
          <Controls
            magnitude={this.state.maxMagnitude}
            magnitudeChange={(magnitude) => this.updateMagnitude(magnitude)}
          />
        </div>
        <div className="main-wrapper">
          {geoJson ? <StarMap geoJson={geoJson} width="100vw" height="100vh" /> : 'LOADING...'}
        </div>
      </>
    );
  }
}
