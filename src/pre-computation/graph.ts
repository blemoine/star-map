import { countBy, flatten, pickBy, uniq } from 'lodash';

export type Vertex = string;
export type Edge = [Vertex, Vertex];

export function reachableVertices(edges: Array<Edge>, vertex: string): Array<string> {
  return Object.keys(_reachableVertices(edges, vertex, { [vertex]: true }));

  function _reachableVertices(
    edges: Array<Edge>,
    vertex: string,
    alreadyReached: { [vertex: string]: boolean }
  ): { [vertex: string]: boolean } {
    return edges
      .map(([v1, v2]) => {
        if (v1 === vertex && !alreadyReached[v2]) {
          return _reachableVertices(edges, v2, { ...alreadyReached, [v2]: true });
        } else if (v2 === vertex && !alreadyReached[v1]) {
          return _reachableVertices(edges, v1, { ...alreadyReached, [v1]: true });
        } else {
          return alreadyReached;
        }
      })
      .reduce((acc, v) => ({ ...acc, ...v }), {});
  }
}

function getVertices(edges: Array<Edge>): Array<string> {
  return uniq(flatten(edges));
}

export function canDrawEulerianTrail(edges: Array<Edge>): boolean {
  if (edges.length === 0) {
    return true;
  } else if (reachableVertices(edges, edges[0][0]).length != getVertices(edges).length) {
    return false;
  } else {
    const vertices = getVertexUsage(edges);
    const oddVertices = Object.keys(pickBy(vertices, (c: number) => c % 2 != 0));
    return oddVertices.length == 0 || oddVertices.length == 2;
  }
}

export function findStartVertex(edges: Array<Edge>): string {
  const vertices = getVertexUsage(edges);
  const oddUsageVertex = Object.keys(vertices).find((v) => vertices[v] % 2 != 0);
  return oddUsageVertex || edges[0][0];
}

function getVertexUsage(edges: Array<Edge>): { [vertex: string]: number } {
  return countBy(flatten(edges));
}

export function fleuryAlgorithm(edges: Array<Edge>): Array<Edge> | { error: string } {
  if (!canDrawEulerianTrail(edges)) {
    return { error: `Edges ${edges} doesn't form an eulerian trail` };
  }
  const firstVertex = findStartVertex(edges);

  return _fleuryAlgorithm(edges, firstVertex);

  function _fleuryAlgorithm(edges: Array<Edge>, start: Vertex): Array<Edge> {
    const adjacents = edges.filter(([a, b]) => a === start || b === start);

    let nextVertex: Vertex | null;
    if (adjacents.length === 1) {
      nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
    } else {
      const firstNonBridge = adjacents.find(([a, b]) => !isBridge(edges, [a, b]));
      if (firstNonBridge) {
        nextVertex = firstNonBridge[0] === start ? firstNonBridge[1] : firstNonBridge[0];
      } else {
        nextVertex = null;
      }
    }

    if (nextVertex === null) {
      return [];
    } else {
      const newEdges = [...edges];
      const idx = newEdges.findIndex(
        ([a, b]) => (a === nextVertex && b === start) || (a === start && b === nextVertex)
      );
      newEdges.splice(idx, 1);
      return [[start, nextVertex], ..._fleuryAlgorithm(newEdges, nextVertex)];
    }
  }
}

export function isBridge(edges: Array<Edge>, [start, end]: Edge): boolean {
  const adjacentsOfStart = edges.filter(([a, b]) => a === start || b === start);

  if (adjacentsOfStart.length === 1) {
    return false;
  } else {
    const countWith = reachableVertices(edges, start);
    const idx = edges.findIndex(([a, b]) => (a === start && b === end) || (a === end && b === start));
    const newEdges = [...edges];
    newEdges.splice(idx, 1);
    const countWithout = reachableVertices(newEdges, start);

    return countWith.length > countWithout.length;
  }
}

export function extendedFleuryAlgorithm(edges: Array<Edge>): Array<Edge> {
  const firstVertex = findStartVertex(edges);

  return _fleuryAlgorithm(edges, firstVertex, []);

  function _fleuryAlgorithm(edges: Array<Edge>, start: Vertex, alreadyChosenPath: Array<Edge>): Array<Edge> {
    if (alreadyChosenPath.length > 200) {
      throw new Error('This algorithm seems to have diverged');
    }
    if (edges.length === 0) {
      return alreadyChosenPath;
    }
    const adjacents = edges.filter(([a, b]) => a === start || b === start);

    const newEdges = [...edges];

    let nextVertex: Vertex | null;
    if (adjacents.length === 1) {
      nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
    } else {
      const firstNonBridge = adjacents.find(([a, b]) => !isBridge(edges, [a, b]));
      if (firstNonBridge) {
        nextVertex = firstNonBridge[0] === start ? firstNonBridge[1] : firstNonBridge[0];
      } else {
        if (adjacents.length === 0) {
          //go backward
          nextVertex = null;
        } else {
          nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
          newEdges.push([start, nextVertex]);
        }
      }
    }

    if (nextVertex === null) {
      return [];
    } else {
      const idx = newEdges.findIndex(
        ([a, b]) => (a === nextVertex && b === start) || (a === start && b === nextVertex)
      );
      newEdges.splice(idx, 1);
      const chosenEdge: Edge = [start, nextVertex];
      return _fleuryAlgorithm(newEdges, nextVertex, alreadyChosenPath.concat([chosenEdge]));
    }
  }
}
