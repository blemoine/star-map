"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function reachableVertices(edges, vertex) {
    return Object.keys(_reachableVertices(edges, vertex, { [vertex]: true }));
    function _reachableVertices(edges, vertex, alreadyReached) {
        return edges
            .map(([v1, v2]) => {
            if (v1 === vertex && !alreadyReached[v2]) {
                return _reachableVertices(edges, v2, Object.assign({}, alreadyReached, { [v2]: true }));
            }
            else if (v2 === vertex && !alreadyReached[v1]) {
                return _reachableVertices(edges, v1, Object.assign({}, alreadyReached, { [v1]: true }));
            }
            else {
                return alreadyReached;
            }
        })
            .reduce((acc, v) => (Object.assign({}, acc, v)), {});
    }
}
exports.reachableVertices = reachableVertices;
function getVertices(edges) {
    return lodash_1.uniq(lodash_1.flatten(edges));
}
function canDrawEulerianTrail(edges) {
    if (edges.length === 0) {
        return true;
    }
    else if (reachableVertices(edges, edges[0][0]).length != getVertices(edges).length) {
        return false;
    }
    else {
        const vertices = getVertexUsage(edges);
        const oddVertices = Object.keys(lodash_1.pickBy(vertices, (c) => c % 2 != 0));
        return oddVertices.length == 0 || oddVertices.length == 2;
    }
}
exports.canDrawEulerianTrail = canDrawEulerianTrail;
function findStartVertex(edges) {
    const vertices = getVertexUsage(edges);
    const oddUsageVertex = Object.keys(vertices).find((v) => vertices[v] % 2 != 0);
    return oddUsageVertex || edges[0][0];
}
exports.findStartVertex = findStartVertex;
function getVertexUsage(edges) {
    return lodash_1.countBy(lodash_1.flatten(edges));
}
function fleuryAlgorithm(edges) {
    if (!canDrawEulerianTrail(edges)) {
        return { error: `Edges ${edges} doesn't form an eulerian trail` };
    }
    const firstVertex = findStartVertex(edges);
    return _fleuryAlgorithm(edges, firstVertex);
    function _fleuryAlgorithm(edges, start) {
        const adjacents = edges.filter(([a, b]) => a === start || b === start);
        let nextVertex;
        if (adjacents.length === 1) {
            nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
        }
        else {
            const firstNonBridge = adjacents.find(([a, b]) => !isBridge(edges, [a, b]));
            if (firstNonBridge) {
                nextVertex = firstNonBridge[0] === start ? firstNonBridge[1] : firstNonBridge[0];
            }
            else {
                nextVertex = null;
            }
        }
        if (nextVertex === null) {
            return [];
        }
        else {
            const newEdges = [...edges];
            const idx = newEdges.findIndex(([a, b]) => (a === nextVertex && b === start) || (a === start && b === nextVertex));
            newEdges.splice(idx, 1);
            return [[start, nextVertex], ..._fleuryAlgorithm(newEdges, nextVertex)];
        }
    }
}
exports.fleuryAlgorithm = fleuryAlgorithm;
function isBridge(edges, [start, end]) {
    const adjacentsOfStart = edges.filter(([a, b]) => a === start || b === start);
    if (adjacentsOfStart.length === 1) {
        return false;
    }
    else {
        const countWith = reachableVertices(edges, start);
        const idx = edges.findIndex(([a, b]) => (a === start && b === end) || (a === end && b === start));
        const newEdges = [...edges];
        newEdges.splice(idx, 1);
        const countWithout = reachableVertices(newEdges, start);
        return countWith.length > countWithout.length;
    }
}
exports.isBridge = isBridge;
function extendedFleuryAlgorithm(edges) {
    const firstVertex = findStartVertex(edges);
    return _fleuryAlgorithm(edges, firstVertex, []);
    function _fleuryAlgorithm(edges, start, alreadyChosenPath) {
        if (alreadyChosenPath.length > 200) {
            throw new Error('This algorithm seems to have diverged');
        }
        if (edges.length === 0) {
            return alreadyChosenPath;
        }
        const adjacents = edges.filter(([a, b]) => a === start || b === start);
        const newEdges = [...edges];
        let nextVertex;
        if (adjacents.length === 1) {
            nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
        }
        else {
            const firstNonBridge = adjacents.find(([a, b]) => !isBridge(edges, [a, b]));
            if (firstNonBridge) {
                nextVertex = firstNonBridge[0] === start ? firstNonBridge[1] : firstNonBridge[0];
            }
            else {
                if (adjacents.length === 0) {
                    //go backward
                    //get all already chosen Path reversed until we find one that connect to a remaining edge.
                    // put all that in alreadyChosenPath, and return
                    const reversed = alreadyChosenPath.map((arr) => [arr[1], arr[0]]).reverse();
                    const backtrack = lodash_1.takeWhile(reversed, (edge) => {
                        return edges.some(([c, d]) => c === edge[1] || d === edge[1]);
                    });
                    return _fleuryAlgorithm(newEdges, backtrack[backtrack.length - 1][1], alreadyChosenPath.concat(backtrack));
                }
                else {
                    nextVertex = adjacents[0][0] === start ? adjacents[0][1] : adjacents[0][0];
                }
                newEdges.push([start, nextVertex]);
            }
        }
        const idx = newEdges.findIndex(([a, b]) => (a === nextVertex && b === start) || (a === start && b === nextVertex));
        newEdges.splice(idx, 1);
        const chosenEdge = [start, nextVertex];
        return _fleuryAlgorithm(newEdges, nextVertex, alreadyChosenPath.concat([chosenEdge]));
    }
}
exports.extendedFleuryAlgorithm = extendedFleuryAlgorithm;
