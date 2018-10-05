import { Star } from '../hygdata/hygdata.utils';
import { raise, sequence, Validated } from '../utils/validated';
import find from 'lodash/find';
import { StarDictionnary } from '../app/AppState';
import { Edge, extendedFleuryAlgorithm, reachableVertices, Vertex } from './graph';
import { flatten, uniqWith, isEqual } from 'lodash';

export function constellationAsStarId(
  stars: StarDictionnary,
  constellation: Array<[string, string]>
): Validated<Array<string>> {
  return sequence(constellation.map(([con, bayerOrFlam]) => constellationPointAsStarId(stars, con, bayerOrFlam)));
}

function constellationPointAsStarId(stars: StarDictionnary, con: string, bayerOrFlam: string): Validated<string> {
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

export function optimizeConstellation(constellations: Array<Array<[string, string]>>): Array<Array<[string, string]>> {
  const withNames = constellations.map((arr) => arr.map(([a, b]) => a + '-' + b));
  const edges: Array<Edge> = flatten(
    withNames.map((arr) =>
      arr
        .map(
          (vertex, idx): Edge | null => {
            if (idx === 0) {
              return null;
            } else {
              return [vertex, arr[idx - 1]];
            }
          }
        )
        .filter(
          (a): a is Edge => {
            return a !== null;
          }
        )
    )
  );
  const allVertices: Array<Vertex> = flatten(flatten(withNames));

  const verticesGroupedByCycle: Array<Array<Vertex>> = uniqWith(
    allVertices.map((v) => reachableVertices(edges, v).sort()),
    isEqual
  );

  const groupedEdges: Array<Array<Edge>> = verticesGroupedByCycle.map(
    (vertices): Array<Edge> => {
      return edges.filter(([a, b]) => {
        return vertices.some((v) => v === a || v === b);
      });
    }
  );

  const optimizedPaths = groupedEdges.map((edges) => {
    return extendedFleuryAlgorithm(edges);
  });

  return optimizedPaths.map((path) => {
    const basePath = path.map((edge) => edge[1]);
    const firstVertex = path[0][0];

    return [firstVertex, ...basePath].map(
      (vertex): [string, string] => {
        const conAndName = vertex.split('-');

        return [conAndName[0], conAndName[1]];
      }
    );
  });
}
