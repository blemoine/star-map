"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
const find_1 = __importDefault(require("lodash/find"));
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
