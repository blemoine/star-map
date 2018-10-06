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
const parsec_1 = require("../measures/parsec");
const vectors_1 = require("../geometry/vectors");
const number_1 = require("../utils/number");
const rc_tooltip_1 = __importDefault(require("rc-tooltip"));
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
require("./informations.css");
exports.Informations = (props) => {
    const formatedPostion = props.position.map((coordinate) => number_1.round(parsec_1.toLightYear(coordinate), 5));
    const nearestStar = props.nearestStar;
    return (React.createElement("div", null,
        React.createElement("ul", null,
            React.createElement("li", null, nearestStar ? (React.createElement(React.Fragment, null,
                "Nearest star is ",
                hygdata_utils_1.formatName(nearestStar),
                " at ",
                hygdata_utils_1.formatDistance(nearestStar))) : (React.createElement("span", { className: "ellipsis-loading" }, "Computing nearest star"))),
            React.createElement("li", null,
                "Acceleration: ",
                React.createElement("em", null, number_1.round(parsec_1.toLightYear(props.acceleration))),
                React.createElement(rc_tooltip_1.default, { placement: "bottom", overlay: React.createElement("span", null,
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Light-year" }, "Light-years"),
                        " is a measurement of distance roughly equals to 9.461 trillions kilometers.",
                        React.createElement("br", null),
                        "The nearest star from earth is",
                        ' ',
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Proxima_Centauri" }, "Proxima Centauri"),
                        ", which is ~4.24 Light-years from earth."), destroyTooltipOnHide: true },
                    React.createElement("span", null, " Light-Years"))),
            React.createElement("li", null,
                "Distance from sun: ",
                number_1.round(parsec_1.toLightYear(vectors_1.vectorLength(props.position))),
                " Light-years"),
            React.createElement("li", null,
                "Postion:",
                React.createElement("ul", null,
                    React.createElement("li", null,
                        "X: ",
                        React.createElement("em", null, formatedPostion[0]),
                        " Light-years"),
                    React.createElement("li", null,
                        "Y: ",
                        React.createElement("em", null, formatedPostion[1]),
                        " Light-years"),
                    React.createElement("li", null,
                        "Z: ",
                        React.createElement("em", null, formatedPostion[2]),
                        " Light-years"))),
            React.createElement("li", null,
                "Rotation:",
                React.createElement("ul", null,
                    React.createElement("li", null,
                        "Lambda: ",
                        React.createElement("em", null, number_1.round(props.rotation.rotateLambda)),
                        " \u02DA"),
                    React.createElement("li", null,
                        "Phi: ",
                        React.createElement("em", null, number_1.round(props.rotation.rotatePhi)),
                        " \u02DA"),
                    React.createElement("li", null,
                        "Gamma: ",
                        React.createElement("em", null, number_1.round(props.rotation.rotateGamma)),
                        " \u02DA"))))));
};
