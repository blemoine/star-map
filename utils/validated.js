"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Err {
    constructor(headErrors, otherErrors) {
        this.headErrors = headErrors;
        this.otherErrors = otherErrors;
        this.kind = 'error';
    }
    errors() {
        return [this.headErrors, ...this.otherErrors];
    }
    combine(err) {
        return new Err(this.headErrors, [...this.otherErrors, ...err.errors()]);
    }
    map(fn) {
        return new Err(fn(this.headErrors), this.otherErrors.map(fn));
    }
}
function raise(message, context) {
    return new Err({ message, context }, []);
}
exports.raise = raise;
function isError(v) {
    return !!v && v.kind === 'error';
}
exports.isError = isError;
function sequence(arr) {
    return arr.reduce((v1, v2) => {
        if (isError(v1) && isError(v2)) {
            return v1.combine(v2);
        }
        else if (isError(v1)) {
            return v1;
        }
        else if (isError(v2)) {
            return v2;
        }
        else {
            v1.push(v2);
            return v1;
        }
    }, []);
}
exports.sequence = sequence;
function map(v, fn) {
    if (isError(v)) {
        return v;
    }
    else {
        return fn(v);
    }
}
exports.map = map;
function flatMap(v, fn) {
    if (isError(v)) {
        return v;
    }
    else {
        return fn(v);
    }
}
exports.flatMap = flatMap;
function zip(v1, v2) {
    if (isError(v1) && isError(v2)) {
        return v1.combine(v2);
    }
    else if (isError(v1)) {
        return v1;
    }
    else if (isError(v2)) {
        return v2;
    }
    else {
        return [v1, v2];
    }
}
exports.zip = zip;
function zip3(v1, v2, v3) {
    return map(zip(zip(v1, v2), v3), ([[a, b], c]) => [a, b, c]);
}
exports.zip3 = zip3;
