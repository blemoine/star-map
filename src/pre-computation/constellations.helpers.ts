import { Star } from '../hygdata/hygdata.utils';
import { raise, sequence, Validated } from '../utils/validated';
import find from 'lodash/find';
import { StarDictionnary } from '../app/AppState';

export function constellationAsStarId(
  stars: StarDictionnary,
  constellation: Array<[string, string]>
): Validated<Array<string>> {
  return sequence(constellation.map(([con, bayerOrFlam]) => constellationPointAsStarId(stars, con, bayerOrFlam)));
}

function constellationPointAsStarId(
  stars: StarDictionnary,
  con: string,
  bayerOrFlam: string,
): Validated<string> {
  const exactStar = find(stars, (star: Star) => {
    return (star.bayer === bayerOrFlam || star.flamsteed === bayerOrFlam) && star.constellation === con.toLowerCase();
  });
  if (exactStar) {
    return exactStar.id;
  } else {
    if (bayerOrFlam.match(/^[a-zA-Z]+$/)) {
      const approxStar = find(stars, (star: Star) => {
        return !!star.bayer && star.bayer.startsWith(bayerOrFlam) && star.constellation === con.toLowerCase();
      });
      if (approxStar) {
        return approxStar.id;
      } else {
        return raise(`The star ${con} and ${bayerOrFlam} is unknown, even in approximate mode`);
      }
    } else {
      return raise(`The star ${con} and ${bayerOrFlam} is unknown`);
    }
  }
}

const convertTable: { [key: string]: string } = {
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
export function convertStarNameToFullName(name: string): string {
  const lowerCasedName = name.toLowerCase();

  const maybeComposite = lowerCasedName.match(/([a-z]+)-([0-9]+)/);

  const keyToSearch = (maybeComposite ? maybeComposite[1] : lowerCasedName).substr(0, 3);
  if (convertTable[keyToSearch]) {
    return maybeComposite ? convertTable[keyToSearch] + '-' + maybeComposite[2] : convertTable[keyToSearch];
  } else {
    return lowerCasedName;
  }
}

export function validateConstellationJson(obj: unknown): obj is Array<Array<[string, string]>> {
  return (
    Array.isArray(obj) &&
    obj.every((c) => {
      return (
        Array.isArray(c) &&
        c.every((i) => {
          return Array.isArray(i) && i.length === 2;
        })
      );
    })
  );
}
