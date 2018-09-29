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
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
const validated_1 = require("../utils/validated");
const spinner_1 = require("../spinner/spinner");
const App_1 = require("./App");
const reduce_1 = require("../utils/reduce");
const coordinates_1 = require("../geometry/coordinates");
const lodash_1 = require("lodash");
class AsyncApp extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            geoJson: null,
            stars: [],
            mandatoryStars: [],
        };
    }
    static getDerivedStateFromProps(props, state) {
        const newState = {};
        if (state.stars.length === 0) {
            newState['stars'] = Object.values(props.stars);
        }
        if (state.mandatoryStars.length === 0) {
            newState['mandatoryStars'] = lodash_1.flatten(props.baseConstellation);
        }
        if (Object.keys(newState).length === 0) {
            return null;
        }
        else {
            return newState;
        }
    }
    componentDidMount() {
        this.loadAsync(this.state.stars, this.state.mandatoryStars, this.props.maxMagnitude, this.props.position);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.position !== this.props.position || prevProps.maxMagnitude !== this.props.maxMagnitude) {
            this.loadAsync(this.state.stars, this.state.mandatoryStars, this.props.maxMagnitude, this.props.position);
        }
    }
    loadAsync(stars, mandatoryStars, maxMagnitude, position) {
        const cancelToken = new Promise(() => { });
        reduce_1.asyncCancellableReduce(stars, (acc, oldStar) => {
            const newStar = hygdata_utils_1.moveOrigin(position, oldStar);
            if (validated_1.isError(newStar)) {
                console.error(newStar.errors());
                return acc;
            }
            else {
                const coordinates = coordinates_1.xyzToLonLat(newStar.coordinates);
                if (validated_1.isError(coordinates)) {
                    console.error(newStar, coordinates.errors());
                    return acc;
                }
                else {
                    const newValue = {
                        id: oldStar.id,
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [-coordinates[0], coordinates[1]] },
                        properties: newStar,
                    };
                    if (newStar.apparentMagnitude < maxMagnitude || mandatoryStars.indexOf(newStar.id) >= 0) {
                        acc.push(newValue);
                    }
                    return acc;
                }
            }
        }, [], cancelToken)
            .then((features) => {
            return {
                type: 'FeatureCollection',
                features,
            };
        })
            .catch((e) => {
            return validated_1.raise('Async reduce failed', { error: e });
        })
            .then((featureCollection) => {
            this.setState((s) => (Object.assign({}, s, { geoJson: featureCollection })));
        });
    }
    render() {
        const geoJson = this.state.geoJson;
        if (!geoJson) {
            return React.createElement(spinner_1.Spinner, null);
        }
        else if (validated_1.isError(geoJson)) {
            //TODO beautify error
            console.error(geoJson);
            return React.createElement("div", null, "FUCKING ERROR");
        }
        else {
            return (React.createElement(App_1.App, { geoJson: geoJson, baseConstellation: this.props.baseConstellation, maxMagnitude: this.props.maxMagnitude, rotation: this.props.rotation, position: this.props.position, acceleration: this.props.acceleration, displayConstellation: this.props.displayConstellation, updateState: this.props.updateState }));
        }
    }
}
exports.AsyncApp = AsyncApp;
