import * as React from 'react';
import { LineString, Point } from 'geojson';

import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { select, event, mouse } from 'd3-selection';
import { geoStereographic, geoPath, geoGraticule, GeoProjection } from 'd3-geo';

import './star-map.css';
import { Rotation } from '../geometry/rotation';
import { multiplyQuaternion, quaternionForRotation } from '../geometry/quaternion';
import { Degree, euler2quat, mkDegree, quat2euler } from '../geometry/euler-angle';
import { GeoCoordinates, lonlat2xyz, mkLatitude, mkLongitude } from '../geometry/coordinates';
import { isError, raise, Validated, zip } from '../utils/validated';
import { Star } from '../hygdata/hygdata.utils';
import { fastAtan2, round } from '../utils/number';
import { toKm } from '../measures/parsec';
import { toFullName } from '../constellations/constellations';
import { rafThrottle } from '../utils/raf-throttle';

type Props = {
  constellation: GeoJSON.FeatureCollection<LineString, {}>;
  geoJson: GeoJSON.FeatureCollection<Point, Star>;
  rotation: Rotation;
  rotationChange: (rotation: Rotation) => void;
};

export class StarMap extends React.Component<Props, {}> {
  private svgNode: SVGSVGElement | null = null;
  private tooltipNode: HTMLDivElement | null = null;
  private projection: GeoProjection = geoStereographic();

  private selectedStar: Star | null = null;

  private throttledRotationChange = rafThrottle(
    (rotation: Rotation): void => {
      this.props.rotationChange(rotation);
    }
  );

  componentDidMount() {
    const height = this.getHeight();
    const width = this.getWidth();

    const defaultScale = Math.min(width / Math.PI, height / Math.PI) * 3;
    const rotation = this.props.rotation;
    this.projection
      .scale(defaultScale)
      .translate([width / 2, height / 2])
      .center([0, 0])
      .rotate([rotation.rotateLambda, rotation.rotatePhi, rotation.rotateGamma]);

    this.update();

    let gpos0: GeoCoordinates | null = null;
    let o0: [Degree, Degree, Degree] | null = null;
    const self = this;
    const svg = select(this.svgNode);

    const projectionInvert = (point: [number, number]): Validated<GeoCoordinates> => {
      if (!this.projection.invert) {
        return raise('The project has no projectionInvert function');
      }
      const inverted = this.projection.invert(point);
      if (inverted === null) {
        return raise(`The point ${point} has no invert in the projection`);
      }
      return zip(mkLongitude(inverted[0]), mkLatitude(inverted[1]));
    };

    const getProjectionRotate = (): [Degree, Degree, Degree] => {
      const baseRotate = self.projection.rotate();

      return [mkDegree(baseRotate[0]), mkDegree(baseRotate[1]), mkDegree(baseRotate[2])];
    };

    const dragDefinition = drag()
      .on('start', function dragstarted() {
        const point = mouse(this as any);
        const maybeInverted = projectionInvert(point);
        if (isError(maybeInverted)) {
          console.error('There is an error in invert projection', maybeInverted.errors());
        } else {
          gpos0 = maybeInverted;
          o0 = getProjectionRotate();
        }
      })
      .on('drag', function dragged() {
        if (gpos0 === null) {
          throw new Error('WTF');
        }
        const point = mouse(this as any);
        const gpos1 = projectionInvert(point);
        if (isError(gpos1)) {
          console.error('There is an error in invert projection', gpos1.errors());
          throw new Error('WTF ');
        }
        o0 = getProjectionRotate();

        const o1 = eulerAngles(gpos0, gpos1, o0);

        self.throttledRotationChange({
          rotateLambda: o1[0],
          rotatePhi: o1[1],
          rotateGamma: o1[2],
        });
      })
      .on('end', function dragended() {
        svg.selectAll('.point').remove();
      });

    svg.call(dragDefinition as any);

    const zoomDefinition = zoom()
      .scaleExtent([1, 10])
      .on('zoom', function() {
        svg.select('.map').attr('transform', event.transform);
        svg.select('.graticule').attr('transform', event.transform);

        self.update();
      });
    svg.call(zoomDefinition as any);
  }
  componentDidUpdate() {
    const rotation = this.props.rotation;
    this.projection.rotate([rotation.rotateLambda, rotation.rotatePhi, rotation.rotateGamma]);
    this.update();
  }

  private update() {
    const projection = this.projection;
    const geoGenerator = geoPath()
      .projection(projection)
      .pointRadius(function(d) {
        if (d && 'properties' in d && d.properties !== null) {
          const star = d.properties;
          const demiAngle = ((star.radius ? fastAtan2(star.radius, star.distance) : 0) * 360) / (2 * Math.PI);
          if (demiAngle > 0.015) {
            const [x0, y0] = projection([0, 0]) || [0, 0];
            const [x1, y1] = projection([demiAngle, demiAngle]) || [0, 0];
            const result = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));

            return result * 2;
          } else {
            const magnitude = star.apparentMagnitude;
            if (magnitude === -Infinity) {
              return 0;
            } else if (magnitude < 2) {
              return 3;
            } else if (magnitude < 3) {
              return 2;
            } else {
              return 1;
            }
          }
        } else {
          return 0;
        }
      });

    const graticule = geoGraticule();

    const svg = select(this.svgNode);
    svg
      .select('.graticule path')
      .datum(graticule())
      .attr('d', geoGenerator);

    const tooltip = select(this.tooltipNode);
    const constellationPath = svg
      .select('g.map')
      .selectAll('path.constellation')
      .data(this.props.constellation.features);
    constellationPath.exit().remove();
    constellationPath
      .enter()
      .append('path')
      .merge(constellationPath)
      .attr('d', geoGenerator)
      .attr('class', 'constellation')
      .style('stroke', '#444')
      .style('fill', 'transparent');

    const starsPath = svg
      .select('g.map')
      .selectAll('path.star')
      .data(this.props.geoJson.features);
    starsPath.exit().remove();
    starsPath
      .enter()
      .append('path')
      .raise()
      .merge(starsPath)
      .attr('d', geoGenerator)
      .attr('class', 'star')
      .style('fill', (d) => {
        if (d === null || d.properties === null) {
          return '';
        }
        const minMagnitude = 2;
        const maxMagnitude = 6;

        const normalizedMagnitude = Math.min(Math.max(d.properties.apparentMagnitude, minMagnitude), maxMagnitude);

        const opacity = (maxMagnitude - normalizedMagnitude) / (maxMagnitude - minMagnitude);
        const color = d.properties.color;
        return `rgba(${color.join(',')},${opacity})`;
      })
      .style('stroke', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseover', (d) => {
        if (d.properties) {
          this.selectedStar = d.properties;
          this.displayTooltip(d.properties);
        } else {
          this.selectedStar = null;
        }
      })
      .on('mousemove', function() {
        tooltip.style('top', event.y + 15 + 'px').style('left', event.x + 15 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
        this.selectedStar = null;
      });

    if (!!this.selectedStar) {
      const id = this.selectedStar.id;
      const d = this.props.geoJson.features.find((feature) => feature.properties.id === id);
      if (d) {
        this.displayTooltip(d.properties);
      }
    }
  }

  private displayTooltip(star: Star) {
    const tooltip = select(this.tooltipNode);
    const radius = star.radius;
    const distance = star.distance;
    tooltip
      .style('visibility', 'visible')
      .html(
        [
          (star.name ? star.name + ', ' : '') + (star.bayer || star.flamsteed) + ' - ' + toFullName(star.constellation),
          'distance: ' + (distance < 10e-5 ? round(toKm(distance), 3) + 'Km' : round(distance, 8) + 'Pc'),
          'magnitude: ' + round(star.apparentMagnitude),
          'radius: ' + (radius ? round(toKm(radius)) : '?') + 'Km',
        ].join('<br />')
      );
  }

  private getHeight(): number {
    if (this.svgNode) {
      if (this.svgNode.clientHeight) {
        return this.svgNode.clientHeight;
      } else {
        const parentNode = this.svgNode.parentNode;
        if (!!parentNode && 'clientHeight' in parentNode) {
          const castedNode: Node & { clientHeight: number } = parentNode;
          return castedNode.clientHeight;
        }
      }
    }
    return 600;
  }

  private getWidth(): number {
    if (this.svgNode) {
      if (this.svgNode.clientWidth) {
        return this.svgNode.clientWidth;
      } else {
        const parentNode = this.svgNode.parentNode;
        if (!!parentNode && 'clientWidth' in parentNode) {
          const castedNode: Node & { clientWidth: number } = parentNode;
          return castedNode.clientWidth;
        }
      }
    }
    return 800;
  }

  render() {
    return (
      <>
        <svg ref={(node) => (this.svgNode = node)} width="100%" height="100%">
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

/*  This function computes the euler angles when given two vectors, and a rotation
	This is really the only math function called with d3 code.

	v0 - starting pos in lon/lat, commonly obtained by projection.invert
	v1 - ending pos in lon/lat, commonly obtained by projection.invert
	o0 - the projection rotation in euler angles at starting pos (v0), commonly obtained by projection.rotate
*/

function eulerAngles(v0: GeoCoordinates, v1: GeoCoordinates, o0: [Degree, Degree, Degree]): [Degree, Degree, Degree] {
  /*
    The math behind this:
    - first calculate the quaternion rotation between the two vectors, v0 & v1
    - then multiply this rotation onto the original rotation at v0
    - finally convert the resulted quat angle back to euler angles for d3 to rotate
    */
  const a = euler2quat(o0);
  const b = lonlat2xyz(v0);
  const c = lonlat2xyz(v1);
  const d = quaternionForRotation(b, c);
  if (d === null) {
    return o0;
  }
  const t = multiplyQuaternion(a, d);

  return quat2euler(t);
}
