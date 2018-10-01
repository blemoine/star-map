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
              return map(xyzToLonLat(newStar.coordinates), newCoordinates => {
                return [-newCoordinates[0], newCoordinates[1]];
              })
            })
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

const table: { [abbr: string]: string } = {
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
export function toFullName(abbr: string): string {
  return table[abbr.toLowerCase()] || abbr;
}
