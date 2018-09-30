"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const d3_drag_1 = require("d3-drag");
const d3_zoom_1 = require("d3-zoom");
const d3_selection_1 = require("d3-selection");
const d3_geo_1 = require("d3-geo");
require("./star-map.css");
const quaternion_1 = require("../geometry/quaternion");
const euler_angle_1 = require("../geometry/euler-angle");
const coordinates_1 = require("../geometry/coordinates");
const validated_1 = require("../utils/validated");
const number_1 = require("../utils/number");
const parsec_1 = require("../measures/parsec");
const constellations_1 = require("../constellations/constellations");
class StarMap extends React.Component {
    constructor() {
        super(...arguments);
        this.svgNode = null;
        this.tooltipNode = null;
        this.projection = d3_geo_1.geoStereographic();
        this.selectedStar = null;
    }
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
        let gpos0 = null;
        let o0 = null;
        const self = this;
        const svg = d3_selection_1.select(this.svgNode);
        const projectionInvert = (point) => {
            if (!this.projection.invert) {
                return validated_1.raise('The project has no projectionInvert function');
            }
            const inverted = this.projection.invert(point);
            if (inverted === null) {
                return validated_1.raise(`The point ${point} has no invert in the projection`);
            }
            return validated_1.zip(coordinates_1.mkLongitude(inverted[0]), coordinates_1.mkLatitude(inverted[1]));
        };
        const getProjectionRotate = () => {
            const baseRotate = self.projection.rotate();
            return [euler_angle_1.mkDegree(baseRotate[0]), euler_angle_1.mkDegree(baseRotate[1]), euler_angle_1.mkDegree(baseRotate[2])];
        };
        const dragDefinition = d3_drag_1.drag()
            .on('start', function dragstarted() {
            const point = d3_selection_1.mouse(this);
            const maybeInverted = projectionInvert(point);
            if (validated_1.isError(maybeInverted)) {
                console.error('There is an error in invert projection', maybeInverted.errors());
            }
            else {
                gpos0 = maybeInverted;
                o0 = getProjectionRotate();
            }
        })
            .on('drag', function dragged() {
            if (gpos0 === null) {
                throw new Error('WTF');
            }
            const point = d3_selection_1.mouse(this);
            const gpos1 = projectionInvert(point);
            if (validated_1.isError(gpos1)) {
                console.error('There is an error in invert projection', gpos1.errors());
                throw new Error('WTF ');
            }
            o0 = getProjectionRotate();
            const o1 = eulerAngles(gpos0, gpos1, o0);
            self.props.rotationChange({
                rotateLambda: o1[0],
                rotatePhi: o1[1],
                rotateGamma: o1[2],
            });
        })
            .on('end', function dragended() {
            svg.selectAll('.point').remove();
        });
        svg.call(dragDefinition);
        const zoomDefinition = d3_zoom_1.zoom()
            .scaleExtent([1, 10])
            .on('zoom', function () {
            svg.select('.map').attr('transform', d3_selection_1.event.transform);
            svg.select('.graticule').attr('transform', d3_selection_1.event.transform);
            self.update();
        });
        svg.call(zoomDefinition);
    }
    componentDidUpdate() {
        const rotation = this.props.rotation;
        this.projection.rotate([rotation.rotateLambda, rotation.rotatePhi, rotation.rotateGamma]);
        this.update();
    }
    update() {
        const projection = this.projection;
        const geoGenerator = d3_geo_1.geoPath()
            .projection(projection)
            .pointRadius(function (d) {
            if (d && 'properties' in d && d.properties !== null) {
                const star = d.properties;
                const demiAngle = ((star.radius ? number_1.fastAtan2(star.radius, star.distance) : 0) * 360) / (2 * Math.PI);
                if (demiAngle > 0.015) {
                    const [x0, y0] = projection([0, 0]) || [0, 0];
                    const [x1, y1] = projection([demiAngle, demiAngle]) || [0, 0];
                    const result = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
                    return result * 2;
                }
                else {
                    const magnitude = star.apparentMagnitude;
                    if (magnitude === -Infinity) {
                        return 0;
                    }
                    else if (magnitude < 2) {
                        return 3;
                    }
                    else if (magnitude < 3) {
                        return 2;
                    }
                    else {
                        return 1;
                    }
                }
            }
            else {
                return 0;
            }
        });
        const graticule = d3_geo_1.geoGraticule();
        const svg = d3_selection_1.select(this.svgNode);
        svg
            .select('.graticule path')
            .datum(graticule())
            .attr('d', geoGenerator);
        const tooltip = d3_selection_1.select(this.tooltipNode);
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
            }
            else {
                this.selectedStar = null;
            }
        })
            .on('mousemove', function () {
            tooltip.style('top', d3_selection_1.event.y + 15 + 'px').style('left', d3_selection_1.event.x + 15 + 'px');
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
    displayTooltip(star) {
        const tooltip = d3_selection_1.select(this.tooltipNode);
        const radius = star.radius;
        const distance = star.distance;
        tooltip
            .style('visibility', 'visible')
            .html([
            (star.name ? star.name + ', ' : '') + (star.bayer || star.flamsteed) + ' - ' + constellations_1.toFullName(star.constellation),
            'distance: ' + (distance < 10e-5 ? number_1.round(parsec_1.toKm(distance), 3) + 'Km' : number_1.round(distance, 8) + 'Pc'),
            'magnitude: ' + number_1.round(star.apparentMagnitude),
            'radius: ' + (radius ? number_1.round(parsec_1.toKm(radius)) : '?') + 'Km',
        ].join('<br />'));
    }
    getHeight() {
        if (this.svgNode) {
            if (this.svgNode.clientHeight) {
                return this.svgNode.clientHeight;
            }
            else {
                const parentNode = this.svgNode.parentNode;
                if (!!parentNode && 'clientHeight' in parentNode) {
                    const castedNode = parentNode;
                    return castedNode.clientHeight;
                }
            }
        }
        return 600;
    }
    getWidth() {
        if (this.svgNode) {
            if (this.svgNode.clientWidth) {
                return this.svgNode.clientWidth;
            }
            else {
                const parentNode = this.svgNode.parentNode;
                if (!!parentNode && 'clientWidth' in parentNode) {
                    const castedNode = parentNode;
                    return castedNode.clientWidth;
                }
            }
        }
        return 800;
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("svg", { ref: (node) => (this.svgNode = node), width: "100%", height: "100%" },
                React.createElement("g", { className: "graticule" },
                    React.createElement("path", null)),
                React.createElement("g", { className: "map" })),
            React.createElement("div", { ref: (node) => (this.tooltipNode = node), className: "tooltip" })));
    }
}
exports.StarMap = StarMap;
/*  This function computes the euler angles when given two vectors, and a rotation
    This is really the only math function called with d3 code.

    v0 - starting pos in lon/lat, commonly obtained by projection.invert
    v1 - ending pos in lon/lat, commonly obtained by projection.invert
    o0 - the projection rotation in euler angles at starting pos (v0), commonly obtained by projection.rotate
*/
function eulerAngles(v0, v1, o0) {
    /*
      The math behind this:
      - first calculate the quaternion rotation between the two vectors, v0 & v1
      - then multiply this rotation onto the original rotation at v0
      - finally convert the resulted quat angle back to euler angles for d3 to rotate
      */
    const a = euler_angle_1.euler2quat(o0);
    const b = coordinates_1.lonlat2xyz(v0);
    const c = coordinates_1.lonlat2xyz(v1);
    const d = quaternion_1.quaternionForRotation(b, c);
    if (d === null) {
        return o0;
    }
    const t = quaternion_1.multiplyQuaternion(a, d);
    return euler_angle_1.quat2euler(t);
}
