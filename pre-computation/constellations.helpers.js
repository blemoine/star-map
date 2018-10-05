"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const find_1 = __importDefault(require("lodash/find"));
const graph_1 = require("./graph");
const lodash_1 = require("lodash");
function constellationAsStarId(stars, constellation) {
    return validated_1.sequence(constellation.map(([con, bayerOrFlam]) => constellationPointAsStarId(stars, con, bayerOrFlam)));
}
exports.constellationAsStarId = constellationAsStarId;
function constellationPointAsStarId(stars, con, bayerOrFlam) {
    const exactStar = find_1.default(stars, (star) => {
        return (star.bayer === bayerOrFlam || star.flamsteed === bayerOrFlam) && star.constellation === con.toLowerCase();
    });
    if (exactStar) {
        return exactStar.id;
    }
    else {
        if (bayerOrFlam.match(/^[a-zA-Z]+$/)) {
            const approxStar = find_1.default(stars, (star) => {
                return !!star.bayer && star.bayer.startsWith(bayerOrFlam) && star.constellation === con.toLowerCase();
            });
            if (approxStar) {
                return approxStar.id;
            }
            else {
                return validated_1.raise(`The star ${con} and ${bayerOrFlam} is unknown, even in approximate mode`);
            }
        }
        else {
            return validated_1.raise(`The star ${con} and ${bayerOrFlam} is unknown`);
        }
    }
}
const convertTable = {
    alp: 'alpha',
    tau: 'tau',
    the: 'theta',
    zet: 'zeta',
    bet: 'beta',
    eps: 'epsilon',
    gam: 'gamma',
    chi: 'chi',
    sig: 'sigma',
    iot: 'iota',
    pi: 'pi',
    rho: 'rho',
    kap: 'kappa',
    eta: 'eta',
    lam: 'lambda',
    del: 'delta',
    mu: 'mu',
    xi: 'xi',
    omi: 'omicron',
    nu: 'nu',
    ups: 'upsilon',
    ome: 'omega',
    phi: 'phi',
    psi: 'psi',
};
function convertStarNameToFullName(name) {
    const lowerCasedName = name.toLowerCase();
    const maybeComposite = lowerCasedName.match(/([a-z]+)-([0-9]+)/);
    const keyToSearch = (maybeComposite ? maybeComposite[1] : lowerCasedName).substr(0, 3);
    if (convertTable[keyToSearch]) {
        return maybeComposite ? convertTable[keyToSearch] + '-' + maybeComposite[2] : convertTable[keyToSearch];
    }
    else {
        return lowerCasedName;
    }
}
exports.convertStarNameToFullName = convertStarNameToFullName;
function validateConstellationJson(obj) {
    return (Array.isArray(obj) &&
        obj.every((c) => {
            return (Array.isArray(c) &&
                c.every((i) => {
                    return Array.isArray(i) && i.length === 2;
                }));
        }));
}
exports.validateConstellationJson = validateConstellationJson;
function optimizeConstellation(constellations) {
    const withNames = constellations.map((arr) => arr.map(([a, b]) => a + '-' + b));
    const edges = lodash_1.flatten(withNames.map((arr) => arr
        .map((vertex, idx) => {
        if (idx === 0) {
            return null;
        }
        else {
            return [vertex, arr[idx - 1]];
        }
    })
        .filter((a) => {
        return a !== null;
    })));
    const allVertices = lodash_1.flatten(lodash_1.flatten(withNames));
    const verticesGroupedByCycle = lodash_1.uniqWith(allVertices.map((v) => graph_1.reachableVertices(edges, v).sort()), lodash_1.isEqual);
    const groupedEdges = verticesGroupedByCycle.map((vertices) => {
        return edges.filter(([a, b]) => {
            return vertices.some((v) => v === a || v === b);
        });
    });
    const optimizedPaths = groupedEdges.map((edges) => {
        return graph_1.extendedFleuryAlgorithm(edges);
    });
    return optimizedPaths.map((path) => {
        const basePath = path.map((edge) => edge[1]);
        const firstVertex = path[0][0];
        return [firstVertex, ...basePath].map((vertex) => {
            const conAndName = vertex.split('-');
            return [conAndName[0], conAndName[1]];
        });
    });
}
exports.optimizeConstellation = optimizeConstellation;
