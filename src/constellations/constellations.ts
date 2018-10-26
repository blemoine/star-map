import { LineString, Position } from 'geojson';
import { moveOrigin } from '../hygdata/hygdata.utils';
import { Vector3D } from '../geometry/vectors';
import { StarDictionnary } from '../app/AppState';
import { xyzToLonLat } from '../geometry/coordinates';
import { flatMap, isError, map } from '../utils/validated';

export const emptyConstellations: GeoJSON.FeatureCollection<LineString, {}> = {
  type: 'FeatureCollection',
  features: [],
};

export function convertConstellationToGeoJson(
  constellations: Array<Array<string>>,
  starDictionnary: StarDictionnary,
  newOrigin: Vector3D
): GeoJSON.FeatureCollection<LineString, {}> {
  const features: Array<GeoJSON.Feature<LineString, {}>> = constellations.map(
    (constellation): GeoJSON.Feature<LineString, {}> => {
      const coordinates: Array<Position> = constellation
        .map((id) => {
          const star = starDictionnary[id];
          if (star) {
            return flatMap(moveOrigin(newOrigin, star), (newStar) => {
              return map(xyzToLonLat(newStar.coordinates), (newCoordinates) => {
                return [-newCoordinates[0], newCoordinates[1]];
              });
            });
          } else {
            return null;
          }
        })
        .filter((x): x is Position => x !== null && !isError(x));

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {},
      };
    }
  );

  return { type: 'FeatureCollection', features };
}

const table: { [abbr: string]: { name: string; genitive: string } } = {
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

export function toFullName(abbr: string): string {
  const nameInfo = table[abbr.toLowerCase()];
  return nameInfo ? nameInfo.name : abbr;
}

export function toGenitiveName(abbr: string): string {
  const nameInfo = table[abbr.toLowerCase()];
  return nameInfo ? nameInfo.genitive : abbr;
}
