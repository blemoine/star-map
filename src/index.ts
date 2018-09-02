import { convertToGeoJson } from './hygdata/hygdata';
import { StarMap } from './map/star-map';
import { isError } from './utils/validated';
import { parse } from 'papaparse';
import * as d3 from 'd3';

/*
<div class="main-wrapper">
  <div>
    <input style="position:absolute" type="number" value="6" step=".1" oninput="updateMaxMagnitude(this.value)"/>
  </div>
  <svg id="main-map" width="100vw" height="100vh">
    <g class="graticule"><path></path></g>
    <g class="circles"></g>
    <g class="map"></g>
  </svg>

</div>
<div class="tooltip" ></div>

 */
const mainWrapper = d3
  .select('body')
  .append('div')
  .attr('class', 'main-wrapper');
mainWrapper
  .append('div')
  .append('input')
  .style('position', 'absolute')
  .attr('type', 'number')
  .attr('value', 6)
  .attr('step', '.1');
const svg = mainWrapper
  .append('svg')
  .attr('id', 'main-map')
  .attr('width', '100vw')
  .attr('height', '100vh');
svg
  .append('g')
  .attr('class', 'graticule')
  .append('path');
svg.append('g').attr('class', 'circles');
svg.append('g').attr('class', 'map');

d3.select('body')
  .append('div')
  .attr('class', 'tooltip');

// ------------------


let csv: Array<Array<string>>;
fetch('data/hygdata_v3.csv')
  .then((r) => r.text())
  .then((rawCsv) => {
    const parsed = parse(rawCsv);
    if (parsed.errors.length > 0) {
      /*
      const [headError, ...tailErrors] = parsed.errors;

      const baseErr = raise(headError.message, headError);
      return tailErrors.reduce((err, e) => err.combine(raise(e.message, e)), baseErr);
      */
      console.error(parsed.errors);
    }
    csv = parsed.data;
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
