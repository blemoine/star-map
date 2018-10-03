import { canDrawEulerianTrail, Edge, findStartVertex, fleuryAlgorithm, isBridge, reachableVertices } from '../graph';

const square: Array<Edge> = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']];

const squareWithHandle: Array<Edge> = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['D', 'E'], ['F', 'E']];

const threeBranchedOnC: Array<Edge> = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['C', 'F'], ['F', 'G']];

const twoTriangles: Array<Edge> = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E'], ['E', 'F'], ['F', 'D']];

describe('canDrawEulerianTrail', () => {
  it('should return true if there is no edges', () => {
    const result = canDrawEulerianTrail([]);
    expect(result).toBe(true);
  });
  it('should return true on a cyclic euclidian graph', () => {
    const result = canDrawEulerianTrail(square);
    expect(result).toBe(true);
  });
  it('should return true on a euclidian path', () => {
    const result = canDrawEulerianTrail(squareWithHandle);
    expect(result).toBe(true);
  });
  it('should return false on a non euclidian path', () => {
    const result = canDrawEulerianTrail(threeBranchedOnC);
    expect(result).toBe(false);
  });
  it('should return false on a non euclidian path', () => {
    const result = canDrawEulerianTrail(twoTriangles);
    expect(result).toBe(false);
  });
});

describe('findStartVertex', () => {
  it('should return the first vertex if the graph is cyclic', () => {
    const result = findStartVertex(square);
    expect(result).toBe('A');
  });
  it('should return the first odd vertex if the graph is non cyclic', () => {
    const result = findStartVertex(squareWithHandle);
    expect(result).toBe('D');
  });
});

describe('reachableVertices', () => {
  it('should return all vertices if the graph is cyclic', () => {
    const expected = ['A', 'B', 'C', 'D'];
    expect(reachableVertices(square, 'A').sort()).toEqual(expected);
    expect(reachableVertices(square, 'B').sort()).toEqual(expected);
    expect(reachableVertices(square, 'C').sort()).toEqual(expected);
    expect(reachableVertices(square, 'D').sort()).toEqual(expected);
  });

  it('should return all vertices if the graph is acyclic', () => {
    const expected = ['A', 'B', 'C', 'D', 'E', 'F'];
    expect(reachableVertices(squareWithHandle, 'A').sort()).toEqual(expected);
    expect(reachableVertices(squareWithHandle, 'B').sort()).toEqual(expected);
    expect(reachableVertices(squareWithHandle, 'C').sort()).toEqual(expected);
    expect(reachableVertices(squareWithHandle, 'D').sort()).toEqual(expected);
    expect(reachableVertices(squareWithHandle, 'E').sort()).toEqual(expected);
    expect(reachableVertices(squareWithHandle, 'F').sort()).toEqual(expected);
  });
  it('should return all vertices if the graph is not eulerian', () => {
    const expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    expect(reachableVertices(threeBranchedOnC, 'A').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'B').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'C').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'D').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'E').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'F').sort()).toEqual(expected);
    expect(reachableVertices(threeBranchedOnC, 'G').sort()).toEqual(expected);
  });
  it('should return all vertices if the graph is not eulerian', () => {
    const expected1 = ['A', 'B', 'C'];
    const expected2 = ['D', 'E', 'F'];
    expect(reachableVertices(twoTriangles, 'A').sort()).toEqual(expected1);
    expect(reachableVertices(twoTriangles, 'B').sort()).toEqual(expected1);
    expect(reachableVertices(twoTriangles, 'C').sort()).toEqual(expected1);
    expect(reachableVertices(twoTriangles, 'D').sort()).toEqual(expected2);
    expect(reachableVertices(twoTriangles, 'E').sort()).toEqual(expected2);
    expect(reachableVertices(twoTriangles, 'F').sort()).toEqual(expected2);
  });
});

describe('fleuryAlgorithm', () => {
  it('should draw correctly a simple graph', () => {
    expect(fleuryAlgorithm([['C', 'B'], ['A', 'B']])).toEqual([['C', 'B'], ['B', 'A']]);
  });
  it('should draw correctly a cyclic graph', () => {
    expect(fleuryAlgorithm(square)).toEqual([['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]);
  });
  it('should draw correctly a non cyclic euclidian graph', () => {
    expect(fleuryAlgorithm(squareWithHandle)).toEqual([
      ['D', 'C'],
      ['C', 'B'],
      ['B', 'A'],
      ['A', 'D'],
      ['D', 'E'],
      ['E', 'F'],
    ]);
  });
  it('should return an error for non euclidian graph', () => {
    expect('error' in fleuryAlgorithm(threeBranchedOnC)).toEqual(true);
  });
});

describe('isBridge', () => {
  it('should return true if the edge is a bridge', () => {
    expect(isBridge(squareWithHandle, ['D', 'E'])).toBe(true);
  });
  it('should return false if the edge is not a bridge', () => {
    expect(isBridge(squareWithHandle, ['A', 'D'])).toBe(false);
    expect(isBridge(squareWithHandle, ['A', 'B'])).toBe(false);
  });
});
