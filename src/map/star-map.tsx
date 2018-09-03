import * as React from 'react';
import { Point } from 'geojson';
import { HygProperty } from '../hygdata/hygdata';
import * as d3 from 'd3';
import './star-map.css';

type Props = {
  height: string;
  width: string;
  geoJson: GeoJSON.FeatureCollection<Point, HygProperty>;
};
type State = {
  rotateLambda: number;
  rotatePhi: number;
  rotateGamma: number;
};

export class StarMap extends React.Component<Props, State> {
  private svgNode: SVGSVGElement | null = null;
  private tooltipNode: HTMLDivElement | null = null;
  private projection: d3.GeoProjection = d3.geoOrthographic();

  state: State = {
    rotateLambda: 0.1,
    rotatePhi: 0,
    rotateGamma: 0,
  };

  componentDidMount() {
    const height = this.svgNode ? this.svgNode.clientHeight : 600;
    const width = this.svgNode ? this.svgNode.clientWidth : 800;

    const defaultScale = Math.min(width / Math.PI, height / Math.PI);
    this.projection
      .scale(defaultScale)
      .translate([width / 2, height / 2])
      .center([0, 0])
      .rotate([this.state.rotateLambda, this.state.rotatePhi, this.state.rotateGamma]);

    this.update();

    let gpos0: [number, number] | null = null;
    let o0: [number, number, number] | null = null;
    const self = this;
    const svg = d3.select(this.svgNode);
    const drag = d3
      .drag()
      .on('start', function dragstarted() {
        if (!self.projection.invert) {
          throw new Error('WTF');
        }
        const point = d3.mouse(this as any);
        gpos0 = self.projection.invert(point);
        o0 = self.projection.rotate();
      })
      .on('drag', function dragged() {
        if (!self.projection.invert || gpos0 === null) {
          throw new Error('WTF');
        }
        const point = d3.mouse(this as any);
        const gpos1 = self.projection.invert(point);
        if (gpos1 === null) {
          throw new Error('WTF');
        }
        o0 = self.projection.rotate();

        const o1 = eulerAngles(gpos0, gpos1, o0);

        if (!o1) return;
        self.projection.rotate(o1);
        self.update();
      })
      .on('end', function dragended() {
        svg.selectAll('.point').remove();
      });

    svg.call(drag as any);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .on('zoom', function() {
        svg.select('.map').attr('transform', d3.event.transform);
        svg.select('.graticule').attr('transform', d3.event.transform);

        self.update();
      });
    svg.call(zoom as any);
  }
  componentDidUpdate() {
    this.update();
  }

  private update() {
    const geoGenerator = d3
      .geoPath()
      .projection(this.projection)
      .pointRadius(function(d) {
        if (d && 'properties' in d && d.properties !== null) {
          const magnitude = d.properties.magnitude;
          if (magnitude === -Infinity) {
            return 0;
          } else if (magnitude < 0) {
            return 3 - magnitude;
          } else if (magnitude < 2) {
            return 3;
          } else if (magnitude < 3) {
            return 2;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      });

    const graticule = d3.geoGraticule();

    const svg = d3.select(this.svgNode);
    svg
      .select('.graticule path')
      .datum(graticule())
      .attr('d', geoGenerator);

    const tooltip = d3.select(this.tooltipNode);
    const starsPath = svg
      .select('g.map')
      .selectAll('path')
      .data(this.props.geoJson.features);
    starsPath.exit().remove();
    starsPath
      .enter()
      .append('path')
      .merge(starsPath)
      .attr('d', geoGenerator)
      .style('fill', (d) => {
        if (d === null || d.properties === null) {
          return '';
        }
        const minMagnitude = 2;
        const maxMagnitude = 6;

        const normalizedMagnitude = Math.min(Math.max(d.properties.magnitude, minMagnitude), maxMagnitude);

        const opacity = (maxMagnitude - normalizedMagnitude) / (maxMagnitude - minMagnitude);

        return `rgba(255,255,255,${opacity})`;
      })
      .style('stroke', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseover', (d) => {
        if (d.properties) {
          tooltip.style('visibility', 'visible').text(d.properties.name);
        }
      })
      .on('mousemove', function() {
        const point = d3.mouse(this as any);
        tooltip.style('top', point[1] + 15 + 'px').style('left', point[0] + 15 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }

  render() {
    return (
      <>
        <svg ref={(node) => (this.svgNode = node)} width={this.props.width} height={this.props.height}>
          <g className="graticule">
            <path />
          </g>
          <g className="map" />
        </svg>
        <div ref={(node) => (this.tooltipNode = node)} className="tooltip" />
      </>
    );
  }
}

// TODO move

var to_radians = Math.PI / 180;
var to_degrees = 180 / Math.PI;

// Helper function: cross product of two vectors v0&v1
function cross(v0: [number, number, number], v1: [number, number, number]): [number, number, number] {
  return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}

//Helper function: dot product of two vectors v0&v1
function dot(v0: [number, number, number], v1: [number, number, number]): number {
  for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
  return sum;
}

function lonlat2xyz(coord: [number, number]): [number, number, number] {
  var lon = coord[0] * to_radians;
  var lat = coord[1] * to_radians;

  var x = Math.cos(lat) * Math.cos(lon);

  var y = Math.cos(lat) * Math.sin(lon);

  var z = Math.sin(lat);

  return [x, y, z];
}

// Helper function:
// This function computes a quaternion representation for the rotation between to vectors
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function quaternion(
  v0: [number, number, number],
  v1: [number, number, number]
): [number, number, number, number] | null {
  const w = cross(v0, v1), // vector pendicular to v0 & v1
    w_len = Math.sqrt(dot(w, w)); // length of w

  if (w_len == 0) return null;

  const theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1))));

  const qi = (w[2] * Math.sin(theta)) / w_len;
  const qj = (-w[1] * Math.sin(theta)) / w_len;
  const qk = (w[0] * Math.sin(theta)) / w_len;
  const qr = Math.cos(theta);
  if (Number.isFinite(theta)) {
    return [qr, qi, qj, qk];
  } else {
    return null;
  }
}

// Helper function:
// This functions converts euler angles to quaternion
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function euler2quat(e: [number, number, number]): [number, number, number, number] {
  const roll = 0.5 * e[0] * to_radians,
    pitch = 0.5 * e[1] * to_radians,
    yaw = 0.5 * e[2] * to_radians,
    sr = Math.sin(roll),
    cr = Math.cos(roll),
    sp = Math.sin(pitch),
    cp = Math.cos(pitch),
    sy = Math.sin(yaw),
    cy = Math.cos(yaw),
    qi = sr * cp * cy - cr * sp * sy,
    qj = cr * sp * cy + sr * cp * sy,
    qk = cr * cp * sy - sr * sp * cy,
    qr = cr * cp * cy + sr * sp * sy;

  return [qr, qi, qj, qk];
}

// This functions computes a quaternion multiply
// Geometrically, it means combining two quant rotations
// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/arithmetic/index.htm
function quatMultiply(
  q1: [number, number, number, number],
  q2: [number, number, number, number]
): [number, number, number, number] {
  const a = q1[0],
    b = q1[1],
    c = q1[2],
    d = q1[3],
    e = q2[0],
    f = q2[1],
    g = q2[2],
    h = q2[3];

  return [
    a * e - b * f - c * g - d * h,
    b * e + a * f + c * h - d * g,
    a * g - b * h + c * e + d * f,
    a * h + b * g - c * f + d * e,
  ];
}

// This function computes quaternion to euler angles
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function quat2euler(t: [number, number, number, number]): [number, number, number] {
  return [
    Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * to_degrees,
    Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * to_degrees,
    Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * to_degrees,
  ];
}

/*  This function computes the euler angles when given two vectors, and a rotation
	This is really the only math function called with d3 code.

	v0 - starting pos in lon/lat, commonly obtained by projection.invert
	v1 - ending pos in lon/lat, commonly obtained by projection.invert
	o0 - the projection rotation in euler angles at starting pos (v0), commonly obtained by projection.rotate
*/

function eulerAngles(
  v0: [number, number],
  v1: [number, number],
  o0: [number, number, number]
): [number, number, number] {
  /*
    The math behind this:
    - first calculate the quaternion rotation between the two vectors, v0 & v1
    - then multiply this rotation onto the original rotation at v0
    - finally convert the resulted quat angle back to euler angles for d3 to rotate
    */
  const a = euler2quat(o0);
  const b = lonlat2xyz(v0);
  const c = lonlat2xyz(v1);
  const d = quaternion(b, c);
  if (d === null) {
    return o0;
  }
  const t = quatMultiply(a, d);

  return quat2euler(t);
}