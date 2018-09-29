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
const rc_tooltip_1 = __importDefault(require("rc-tooltip"));
require("rc-tooltip/assets/bootstrap_white.css");
require("./controls.css");
exports.Controls = (props) => {
    return (React.createElement("div", { className: "controls-wrapper" },
        React.createElement("div", { className: "form-element" },
            React.createElement(rc_tooltip_1.default, { placement: "bottom", overlay: React.createElement("span", null,
                    "The ",
                    React.createElement("a", { href: "https://en.wikipedia.org/wiki/Apparent_magnitude" }, "Magnitude"),
                    " is a measurement of the luminosity of stars. The higher the magnitude, the less visible is the star. ",
                    React.createElement("br", null),
                    "The stars with magnitude greater than 6 are not visible with naked eyes. In cities, stars with magnitude greater than 3 are often not visible."), destroyTooltipOnHide: true },
                React.createElement("label", null, "Magnitude")),
            React.createElement("input", { type: "number", value: props.magnitude, onChange: (e) => props.magnitudeChange(parseFloat(e.target.value)), max: 6, step: 0.25 })),
        React.createElement("div", { className: "form-element" },
            React.createElement(rc_tooltip_1.default, { placement: "bottom", overlay: React.createElement("span", null,
                    React.createElement("a", { href: "https://en.wikipedia.org/wiki/Constellation" }, "Constellation"),
                    " are often ",
                    React.createElement("em", null, "drawn"),
                    " from stars that have no other links than to be in same general direction. Those stars can in reality be really far from each others. ",
                    React.createElement("br", null),
                    "So, while staying in the neighbourhood (some light-years) of the solar system, the constellation will appear slightly deformed, the further you move, the less the constellation will make sense. That's why you can hide them if you want to navigate far into the galaxy."), destroyTooltipOnHide: true },
                React.createElement("button", { onClick: () => props.displayConstellationChange(!props.displayConstellation) }, props.displayConstellation ? 'Hide Constellations' : 'Show Constellations')))));
};
