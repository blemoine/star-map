"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("../graph");
const square = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']];
const squareWithHandle = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['D', 'E'], ['F', 'E']];
const threeBranchedOnC = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['C', 'F'], ['F', 'G']];
const twoTriangles = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E'], ['E', 'F'], ['F', 'D']];
describe('canDrawEulerianTrail', () => {
    it('should return true if there is no edges', () => {
        const result = graph_1.canDrawEulerianTrail([]);
        expect(result).toBe(true);
    });
    it('should return true on a cyclic euclidian graph', () => {
        const result = graph_1.canDrawEulerianTrail(square);
        expect(result).toBe(true);
    });
    it('should return true on a euclidian path', () => {
        const result = graph_1.canDrawEulerianTrail(squareWithHandle);
        expect(result).toBe(true);
    });
    it('should return false on a non euclidian path', () => {
        const result = graph_1.canDrawEulerianTrail(threeBranchedOnC);
        expect(result).toBe(false);
    });
    it('should return false on a non euclidian path', () => {
        const result = graph_1.canDrawEulerianTrail(twoTriangles);
        expect(result).toBe(false);
    });
});
describe('findStartVertex', () => {
    it('should return the first vertex if the graph is cyclic', () => {
        const result = graph_1.findStartVertex(square);
        expect(result).toBe('A');
    });
    it('should return the first odd vertex if the graph is non cyclic', () => {
        const result = graph_1.findStartVertex(squareWithHandle);
        expect(result).toBe('D');
    });
});
describe('reachableVertices', () => {
    it('should return all vertices if the graph is cyclic', () => {
        const expected = ['A', 'B', 'C', 'D'];
        expect(graph_1.reachableVertices(square, 'A').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(square, 'B').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(square, 'C').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(square, 'D').sort()).toEqual(expected);
    });
    it('should return all vertices if the graph is acyclic', () => {
        const expected = ['A', 'B', 'C', 'D', 'E', 'F'];
        expect(graph_1.reachableVertices(squareWithHandle, 'A').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(squareWithHandle, 'B').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(squareWithHandle, 'C').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(squareWithHandle, 'D').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(squareWithHandle, 'E').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(squareWithHandle, 'F').sort()).toEqual(expected);
    });
    it('should return all vertices if the graph is not eulerian', () => {
        const expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        expect(graph_1.reachableVertices(threeBranchedOnC, 'A').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'B').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'C').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'D').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'E').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'F').sort()).toEqual(expected);
        expect(graph_1.reachableVertices(threeBranchedOnC, 'G').sort()).toEqual(expected);
    });
    it('should return all vertices if the graph is not eulerian', () => {
        const expected1 = ['A', 'B', 'C'];
        const expected2 = ['D', 'E', 'F'];
        expect(graph_1.reachableVertices(twoTriangles, 'A').sort()).toEqual(expected1);
        expect(graph_1.reachableVertices(twoTriangles, 'B').sort()).toEqual(expected1);
        expect(graph_1.reachableVertices(twoTriangles, 'C').sort()).toEqual(expected1);
        expect(graph_1.reachableVertices(twoTriangles, 'D').sort()).toEqual(expected2);
        expect(graph_1.reachableVertices(twoTriangles, 'E').sort()).toEqual(expected2);
        expect(graph_1.reachableVertices(twoTriangles, 'F').sort()).toEqual(expected2);
    });
});
describe('fleuryAlgorithm', () => {
    it('should draw correctly a simple graph', () => {
        expect(graph_1.fleuryAlgorithm([['C', 'B'], ['A', 'B']])).toEqual([['C', 'B'], ['B', 'A']]);
    });
    it('should draw correctly a cyclic graph', () => {
        expect(graph_1.fleuryAlgorithm(square)).toEqual([['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]);
    });
    it('should draw correctly a non cyclic euclidian graph', () => {
        expect(graph_1.fleuryAlgorithm(squareWithHandle)).toEqual([
            ['D', 'C'],
            ['C', 'B'],
            ['B', 'A'],
            ['A', 'D'],
            ['D', 'E'],
            ['E', 'F'],
        ]);
    });
    it('should return an error for non euclidian graph', () => {
        expect('error' in graph_1.fleuryAlgorithm(threeBranchedOnC)).toEqual(true);
    });
});
describe('isBridge', () => {
    it('should return true if the edge is a bridge', () => {
        expect(graph_1.isBridge(squareWithHandle, ['D', 'E'])).toBe(true);
    });
    it('should return false if the edge is not a bridge', () => {
        expect(graph_1.isBridge(squareWithHandle, ['A', 'D'])).toBe(false);
        expect(graph_1.isBridge(squareWithHandle, ['A', 'B'])).toBe(false);
    });
});
describe('extendedFleuryAlgorithm', () => {
    it('should draw correctly a simple graph', () => {
        expect(graph_1.extendedFleuryAlgorithm([['C', 'B'], ['A', 'B']])).toEqual([['C', 'B'], ['B', 'A']]);
    });
    it('should draw correctly a cyclic graph', () => {
        expect(graph_1.extendedFleuryAlgorithm(square)).toEqual([['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]);
    });
    it('should draw correctly a non cyclic euclidian graph', () => {
        expect(graph_1.extendedFleuryAlgorithm(squareWithHandle)).toEqual([
            ['D', 'C'],
            ['C', 'B'],
            ['B', 'A'],
            ['A', 'D'],
            ['D', 'E'],
            ['E', 'F'],
        ]);
    });
    it('should work for a non euclidian trail', () => {
        const result = graph_1.extendedFleuryAlgorithm(threeBranchedOnC);
        expect(result).toEqual([
            ['A', 'B'],
            ['B', 'C'],
            ['C', 'D'],
            ['D', 'E'],
            ['E', 'D'],
            ['D', 'C'],
            ['C', 'F'],
            ['F', 'G'],
        ]);
    });
    it('should work for another euclidian trail', () => {
        const result = graph_1.extendedFleuryAlgorithm([
            ['A', 'B'],
            ['B', 'C'],
            ['C', 'D'],
            ['D', 'E'],
            ['F', 'E'],
            ['F', 'FF'],
            ['D', 'G'],
            ['G', 'GG'],
            ['GG', 'H'],
            ['H', 'I'],
            ['H', 'J'],
            ['J', 'K'],
            ['H', 'K'],
        ]);
        expect(result).toEqual([
            ['A', 'B'],
            ['B', 'C'],
            ['C', 'D'],
            ['D', 'E'],
            ['E', 'F'],
            ['F', 'FF'],
            ['FF', 'F'],
            ['F', 'E'],
            ['E', 'D'],
            ['D', 'G'],
            ['G', 'GG'],
            ['GG', 'H'],
            ['H', 'J'],
            ['J', 'K'],
            ['K', 'H'],
            ['H', 'I'],
        ]);
    });
});
