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
const number_1 = require("../utils/number");
const rc_tooltip_1 = __importDefault(require("rc-tooltip"));
exports.Informations = (props) => {
    const formatedPostion = props.position.map((coordinate) => number_1.round(coordinate, 5));
    return (React.createElement("div", null,
        React.createElement("ul", null,
            React.createElement("li", null,
                "Acceleration: ",
                React.createElement("em", null, number_1.round(props.acceleration)),
                React.createElement(rc_tooltip_1.default, { placement: "bottom", overlay: React.createElement("span", null,
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Parsec" }, "Parsec"),
                        " is a measurement of distance roughly equals to 3.26 light-years or 30 trillions kilometers.",
                        React.createElement("br", null),
                        "The nearest star from earth is",
                        ' ',
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Proxima_Centauri" }, "Proxima Centauri"),
                        ", which is ~1.3 Parsec from earth."), destroyTooltipOnHide: true },
                    React.createElement("span", null, " Parsec"))),
            React.createElement("li", null,
                "Postion:",
                React.createElement("ul", null,
                    React.createElement("li", null,
                        "X: ",
                        React.createElement("em", null, formatedPostion[0]),
                        " Parsec"),
                    React.createElement("li", null,
                        "Y: ",
                        React.createElement("em", null, formatedPostion[1]),
                        " Parsec"),
                    React.createElement("li", null,
                        "Z: ",
                        React.createElement("em", null, formatedPostion[2]),
                        " Parsec"))),
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
