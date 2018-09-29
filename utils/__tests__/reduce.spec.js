"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
const fc = __importStar(require("fast-check"));
describe('asyncCancellableReduce', () => {
    it('should return the init if the arr is empty', () => {
        const init = 12;
        return reduce_1.asyncCancellableReduce([], (acc) => acc, init, new Promise(() => { })).then((r) => {
            expect(r).toEqual(init);
        });
    });
    it('should reduce correctly an array', (done) => {
        fc.assert(fc.property(fc.array(fc.float()), fc.float(), function (arr, init) {
            const cb = (acc, i) => acc + i;
            reduce_1.asyncCancellableReduce(arr, cb, init, new Promise(() => { })).then((r) => {
                expect(r).toEqual(arr.reduce(cb, init));
            }).then(done, done);
        }));
    });
    it('should be able to cancel the promise', () => {
        const init = 10;
        const promise = new Promise((resolve) => resolve());
        const result = reduce_1.asyncCancellableReduce([1, 2, 3, 4, 5, 6], () => {
            throw new Error('SHould not be called');
        }, init, promise).then((r) => {
            expect(r).toEqual(31);
        });
        return result.then(() => {
            fail('The promise should be cancelled');
        }, (e) => {
            expect(e).toBe('Promise was canceled');
        });
    });
});
