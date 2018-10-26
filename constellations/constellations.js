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
                    return validated_1.map(coordinates_1.xyzToLonLat(newStar.coordinates), (newCoordinates) => {
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
    and: { genitive: 'Andromedae', name: 'Andromeda' },
    ant: { genitive: 'Antliae', name: 'Antlia' },
    aps: { genitive: 'Apodis', name: 'Apus' },
    aqr: { genitive: 'Aquarii', name: 'Aquarius' },
    aql: { genitive: 'Aquilae', name: 'Aquila' },
    ara: { genitive: 'Arae', name: 'Ara' },
    ari: { genitive: 'Arietis', name: 'Aries' },
    aur: { genitive: 'Aurigae', name: 'Auriga' },
    boo: { genitive: 'Boötis', name: 'Boötes' },
    cae: { genitive: 'Caeli', name: 'Caelum' },
    cam: { genitive: 'Camelopardalis', name: 'Camelopardalis' },
    cnc: { genitive: 'Cancri', name: 'Cancer' },
    cvn: { genitive: 'Canum Venaticorum', name: 'Canes Venatici' },
    cma: { genitive: 'Canis Majoris', name: 'Canis Major' },
    cmi: { genitive: 'Canis Minoris', name: 'Canis Minor' },
    cap: { genitive: 'Capricorni', name: 'Capricornus' },
    car: { genitive: 'Carinae', name: 'Carina' },
    cas: { genitive: 'Cassiopeiae', name: 'Cassiopeia' },
    cen: { genitive: 'Centauri', name: 'Centaurus' },
    cep: { genitive: 'Cephei', name: 'Cepheus' },
    cet: { genitive: 'Ceti', name: 'Cetus' },
    cha: { genitive: 'Chamaeleontis', name: 'Chamaeleon' },
    cir: { genitive: 'Circini', name: 'Circinus' },
    col: { genitive: 'Columbae', name: 'Columba' },
    com: { genitive: 'Comae Berenices', name: 'Coma Berenices' },
    cra: { genitive: 'Coronae Australis', name: 'Corona Austrina' },
    crb: { genitive: 'Coronae Borealis', name: 'Corona Borealis' },
    crv: { genitive: 'Corvi', name: 'Corvus' },
    crt: { genitive: 'Crateris', name: 'Crater' },
    cru: { genitive: 'Crucis', name: 'Crux' },
    cyg: { genitive: 'Cygni', name: 'Cygnus' },
    del: { genitive: 'Delphini', name: 'Delphinus' },
    dor: { genitive: 'Doradus', name: 'Dorado' },
    dra: { genitive: 'Draconis', name: 'Draco' },
    equ: { genitive: 'Equulei', name: 'Equuleus' },
    eri: { genitive: 'Eridani', name: 'Eridanus' },
    for: { genitive: 'Fornacis', name: 'Fornax' },
    gem: { genitive: 'Geminorum', name: 'Gemini' },
    gru: { genitive: 'Gruis', name: 'Grus' },
    her: { genitive: 'Herculis', name: 'Hercules' },
    hor: { genitive: 'Horologii', name: 'Horologium' },
    hya: { genitive: 'Hydrae', name: 'Hydra' },
    hyi: { genitive: 'Hydri', name: 'Hydrus' },
    ind: { genitive: 'Indi', name: 'Indus' },
    lac: { genitive: 'Lacertae', name: 'Lacerta' },
    leo: { genitive: 'Leonis', name: 'Leo' },
    lmi: { genitive: 'Leonis Minoris', name: 'Leo Minor' },
    lep: { genitive: 'Leporis', name: 'Lepus' },
    lib: { genitive: 'Librae', name: 'Libra' },
    lup: { genitive: 'Lupi', name: 'Lupus' },
    lyn: { genitive: 'Lyncis', name: 'Lynx' },
    lyr: { genitive: 'Lyrae', name: 'Lyra' },
    men: { genitive: 'Mensae', name: 'Mensa' },
    mic: { genitive: 'Microscopii', name: 'Microscopium' },
    mon: { genitive: 'Monocerotis', name: 'Monoceros' },
    mus: { genitive: 'Muscae', name: 'Musca' },
    nor: { genitive: 'Normae', name: 'Norma' },
    oct: { genitive: 'Octantis', name: 'Octans' },
    oph: { genitive: 'Ophiuchi', name: 'Ophiuchus' },
    ori: { genitive: 'Orionis', name: 'Orion' },
    pav: { genitive: 'Pavonis', name: 'Pavo' },
    peg: { genitive: 'Pegasi', name: 'Pegasus' },
    per: { genitive: 'Persei', name: 'Perseus' },
    phe: { genitive: 'Phoenicis', name: 'Phoenix' },
    pic: { genitive: 'Pictoris', name: 'Pictor' },
    psc: { genitive: 'Piscium', name: 'Pisces' },
    psa: { genitive: 'Piscis Austrini', name: 'Piscis Austrinus' },
    pup: { genitive: 'Puppis', name: 'Puppis' },
    pyx: { genitive: 'Pyxidis', name: 'Pyxis' },
    ret: { genitive: 'Reticuli', name: 'Reticulum' },
    sge: { genitive: 'Sagittae', name: 'Sagitta' },
    sgr: { genitive: 'Sagittarii', name: 'Sagittarius' },
    sco: { genitive: 'Scorpii', name: 'Scorpius' },
    scl: { genitive: 'Sculptoris', name: 'Sculptor' },
    sct: { genitive: 'Scuti', name: 'Scutum' },
    ser: { genitive: 'Serpentis', name: 'Serpens' },
    sex: { genitive: 'Sextantis', name: 'Sextans' },
    tau: { genitive: 'Tauri', name: 'Taurus' },
    tel: { genitive: 'Telescopii', name: 'Telescopium' },
    tri: { genitive: 'Trianguli', name: 'Triangulum' },
    tra: { genitive: 'Trianguli Australis', name: 'Triangulum Australe' },
    tuc: { genitive: 'Tucanae', name: 'Tucana' },
    uma: { genitive: 'Ursae Majoris', name: 'Ursa Major' },
    umi: { genitive: 'Ursae Minoris', name: 'Ursa Minor' },
    vel: { genitive: 'Velorum', name: 'Vela' },
    vir: { genitive: 'Virginis', name: 'Virgo' },
    vol: { genitive: 'Volantis', name: 'Volans' },
    vul: { genitive: 'Vulpeculae', name: 'Vulpecula' },
};
function toFullName(abbr) {
    const nameInfo = table[abbr.toLowerCase()];
    return nameInfo ? nameInfo.name : abbr;
}
exports.toFullName = toFullName;
function toGenitiveName(abbr) {
    const nameInfo = table[abbr.toLowerCase()];
    return nameInfo ? nameInfo.genitive : abbr;
}
exports.toGenitiveName = toGenitiveName;
