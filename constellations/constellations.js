"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hygdata_utils_1 = require("../hygdata/hygdata.utils");
const coordinates_1 = require("../geometry/coordinates");
const validated_1 = require("../utils/validated");
exports.emptyConstellations = {
    type: 'FeatureCollection',
    features: [],
};
function convertConstellationToGeoJson(constellations, starDictionnary, newOrigin) {
    const features = constellations.map((constellation) => {
        const coordinates = constellation
            .map((id) => {
            const star = starDictionnary[id];
            if (star) {
                return validated_1.flatMap(hygdata_utils_1.moveOrigin(newOrigin, star), (newStar) => {
                    return validated_1.map(coordinates_1.xyzToLonLat(newStar.coordinates), newCoordinates => {
                        return [-newCoordinates[0], newCoordinates[1]];
                    });
                });
            }
            else {
                return null;
            }
        })
            .filter((x) => x !== null && !validated_1.isError(x));
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates,
            },
            properties: {},
        };
    });
    return { type: 'FeatureCollection', features };
}
exports.convertConstellationToGeoJson = convertConstellationToGeoJson;
const table = {
    and: 'Andromeda',
    ant: 'Antlia',
    aps: 'Apus',
    aqr: 'Aquarius',
    aql: 'Aquila',
    ara: 'Ara',
    ari: 'Aries',
    aur: 'Auriga',
    boo: 'Boötes',
    cae: 'Caelum',
    cam: 'Camelopardalis',
    cnc: 'Cancer',
    cvn: 'Canes Venatici',
    cma: 'Canis Major',
    cmi: 'Canis Minor',
    cap: 'Capricornus',
    car: 'Carina',
    cas: 'Cassiopeia',
    cen: 'Centaurus',
    cep: 'Cepheus',
    cet: 'Cetus',
    cha: 'Chamaeleon',
    cir: 'Circinus',
    col: 'Columba',
    com: 'Coma Berenices',
    cra: 'Corona Austrina',
    crb: 'Corona Borealis',
    crv: 'Corvus',
    crt: 'Crater',
    cru: 'Crux',
    cyg: 'Cygnus',
    del: 'Delphinus',
    dor: 'Dorado',
    dra: 'Draco',
    equ: 'Equuleus',
    eri: 'Eridanus',
    for: 'Fornax',
    gem: 'Gemini',
    gru: 'Grus',
    her: 'Hercules',
    hor: 'Horologium',
    hya: 'Hydra',
    hyi: 'Hydrus',
    ind: 'Indus',
    lac: 'Lacerta',
    leo: 'Leo',
    lmi: 'Leo Minor',
    lep: 'Lepus',
    lib: 'Libra',
    lup: 'Lupus',
    lyn: 'Lynx',
    lyr: 'Lyra',
    men: 'Mensa',
    mic: 'Microscopium',
    mon: 'Monoceros',
    mus: 'Musca',
    nor: 'Norma',
    oct: 'Octans',
    oph: 'Ophiuchus',
    ori: 'Orion',
    pav: 'Pavo',
    peg: 'Pegasus',
    per: 'Perseus',
    phe: 'Phoenix',
    pic: 'Pictor',
    psc: 'Pisces',
    psa: 'Piscis Austrinus',
    pup: 'Puppis',
    pyx: 'Pyxis',
    ret: 'Reticulum',
    sge: 'Sagitta',
    sgr: 'Sagittarius',
    sco: 'Scorpius',
    scl: 'Sculptor',
    sct: 'Scutum',
    ser: 'Serpens',
    sex: 'Sextans',
    tau: 'Taurus',
    tel: 'Telescopium',
    tri: 'Triangulum',
    tra: 'Triangulum Australe',
    tuc: 'Tucana',
    uma: 'Ursa Major',
    umi: 'Ursa Minor',
    vel: 'Vela',
    vir: 'Virgo',
    vol: 'Volans',
    vul: 'Vulpecula',
};
function toFullName(abbr) {
    return table[abbr.toLowerCase()] || abbr;
}
exports.toFullName = toFullName;
