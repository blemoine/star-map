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
const App_1 = require("./App");
const euler_angle_1 = require("../geometry/euler-angle");
const parsec_1 = require("../measures/parsec");
const lodash_1 = require("lodash");
const spinner_1 = require("../spinner/spinner");
const uuid_1 = require("../utils/uuid");
const baseAcceleration = parsec_1.mkParsec(0.000001);
class AppStateContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            baseStars: null,
            baseConstellation: null,
            currentAcceleration: baseAcceleration,
            maxMagnitude: 4.5,
            rotation: {
                rotateLambda: 0,
                rotatePhi: 0,
                rotateGamma: 0,
            },
            position: [0, 0, 0],
            displayConstellation: true,
        };
        this.reinitAcceleration = lodash_1.debounce(() => {
            this.setState((s) => (Object.assign({}, s, { currentAcceleration: baseAcceleration })));
        }, 300);
        this.keyPressListener = (e) => {
            if (!e.srcElement || e.srcElement.tagName.toLowerCase() !== 'input') {
                const lon = euler_angle_1.toRadians(euler_angle_1.mkDegree(this.state.rotation.rotateLambda));
                const lat = euler_angle_1.toRadians(euler_angle_1.mkDegree(this.state.rotation.rotatePhi));
                const acceleration = e.shiftKey ? 0.3 : this.state.currentAcceleration;
                const x = Math.cos(lat) * Math.cos(lon) * acceleration;
                const y = Math.cos(lat) * Math.sin(lon) * acceleration;
                const z = -Math.sin(lat) * acceleration;
                const s = this.state;
                const newAcceleration = s.currentAcceleration < 2
                    ? parsec_1.add(s.currentAcceleration, parsec_1.minParsec(parsec_1.mkParsec(0.003), s.currentAcceleration))
                    : s.currentAcceleration;
                if (e.key === 'ArrowUp') {
                    this.setState((state) => (Object.assign({}, state, { currentAcceleration: newAcceleration, position: [s.position[0] + x, s.position[1] + y, s.position[2] + z] })));
                    this.reinitAcceleration();
                }
                else if (e.key === 'ArrowDown') {
                    this.setState((state) => (Object.assign({}, state, { currentAcceleration: newAcceleration, position: [s.position[0] - x, s.position[1] - y, s.position[2] - z] })));
                    this.reinitAcceleration();
                }
                else if (e.code === 'KeyW') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotatePhi: state.rotation.rotatePhi - 3 }) })));
                }
                else if (e.code === 'KeyS') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotatePhi: state.rotation.rotatePhi + 3 }) })));
                }
                else if (e.code === 'KeyA') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotateLambda: state.rotation.rotateLambda + 3 }) })));
                }
                else if (e.code === 'KeyD') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotateLambda: state.rotation.rotateLambda - 3 }) })));
                }
                else if (e.code === 'KeyQ') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotateGamma: state.rotation.rotateGamma + 3 }) })));
                }
                else if (e.code === 'KeyE') {
                    this.setState((state) => (Object.assign({}, state, { rotation: Object.assign({}, state.rotation, { rotateGamma: state.rotation.rotateGamma - 3 }) })));
                }
            }
        };
    }
    componentDidMount() {
        fetch('data/precomputation.json')
            .then((r) => r.json())
            .then((json) => {
            this.setState((s) => (Object.assign({}, s, { baseStars: { id: uuid_1.uuid(), stars: json.stars }, baseConstellation: { id: uuid_1.uuid(), constellations: json.constellations } })));
        });
        document.addEventListener('keydown', this.keyPressListener);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyPressListener);
    }
    render() {
        const baseStars = this.state.baseStars;
        const baseConstellation = this.state.baseConstellation;
        if (!!baseStars && !!baseConstellation) {
            return (React.createElement(App_1.App, { baseStarDictionnary: baseStars, baseConstellation: baseConstellation, acceleration: this.state.currentAcceleration, maxMagnitude: this.state.maxMagnitude, displayConstellation: this.state.displayConstellation, position: this.state.position, rotation: this.state.rotation, updateState: (partialState) => this.setState((previousState) => (Object.assign({}, previousState, partialState))) }));
        }
        else {
            return (React.createElement("div", { style: {
                    position: 'fixed',
                    top: '45%',
                    textAlign: 'center',
                    width: '100%',
                } },
                React.createElement(spinner_1.Spinner, null)));
        }
    }
}
exports.AppStateContainer = AppStateContainer;
