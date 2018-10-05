"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const controls_1 = require("../controls/controls");
const informations_1 = require("../informations/informations");
const star_map_container_1 = require("../map/star-map.container");
const sortBy_1 = __importDefault(require("lodash/sortBy"));
exports.App = (props) => {
    const starsWithName = sortBy_1.default(Object.values(props.baseStarDictionnary.stars).filter((star) => !!star.name.trim()), (star) => star.name.toLowerCase());
    const updateSelectedStar = (selectedStar) => {
        if (!selectedStar) {
            props.updateState({ selectedStar });
        }
        else {
            props.updateState({ selectedStar, position: selectedStar.coordinates });
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: {
                position: 'absolute',
                width: '100%',
                paddingBottom: '5px',
                paddingTop: '5px',
                backgroundColor: 'rgba(55,55,55,0.8)',
            } },
            React.createElement(controls_1.Controls, { displayConstellation: props.displayConstellation, displayConstellationChange: (displayConstellation) => props.updateState({ displayConstellation }), magnitude: props.maxMagnitude, magnitudeChange: (maxMagnitude) => props.updateState({ maxMagnitude }), changeSelectedStar: (selectedStar) => updateSelectedStar(selectedStar), selectedStar: props.selectedStar, starsWithNane: starsWithName })),
        React.createElement("div", { style: {
                position: 'absolute',
                width: '300px',
                top: '100px',
                left: 0,
                border: '1px solid #AAA',
                backgroundColor: 'rgba(55,55,55,0.8)',
            } },
            React.createElement(informations_1.Informations, { acceleration: props.acceleration, position: props.position, rotation: props.rotation, nearestStar: props.nearestStar })),
        React.createElement("div", { className: "main-wrapper", style: { width: '100vw', height: '100vh' } },
            React.createElement(star_map_container_1.StarMapContainer, { starDictionnary: props.baseStarDictionnary, constellations: props.baseConstellation, rotation: props.rotation, updateRotation: (rotation) => props.updateState({ rotation }), maxMagnitude: props.maxMagnitude, position: props.position, displayConstellation: props.displayConstellation, updateNearestStar: (nearestStar) => props.updateState({ nearestStar }) }))));
};
