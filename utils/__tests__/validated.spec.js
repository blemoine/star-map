"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../validated");
const fc = __importStar(require("fast-check"));
describe('isError', () => {
    it('raise should be an error', () => {
        const e = validated_1.raise('An error');
        expect(validated_1.isError(e)).toBe(true);
    });
    it('should not be an error if raise is not used', () => {
        fc.assert(fc.property(fc.anything(), function (a) {
            expect(validated_1.isError(a)).toBe(false);
        }));
    });
});
describe('sequence', () => {
    it('should invert Array and Success if there is no error', () => {
        fc.assert(fc.property(fc.array(fc.anything()), function (a) {
            const b = validated_1.sequence(a);
            expect(b).toEqual(a);
        }));
    });
    it('should accumulate the error', () => {
        const err1 = validated_1.raise('error1');
        const err2 = validated_1.raise('error2');
        const a = [1, err1, 2, err2];
        const result = validated_1.sequence(a);
        if (!validated_1.isError(result)) {
            fail(`${result} should be an error`);
        }
        else {
            expect(result.errors()).toEqual(err1.errors().concat(err2.errors()));
        }
    });
});
const errArb = fc.string().map((str) => validated_1.raise(str));
function validatedGenerator(arb) {
    return fc.oneof(arb, errArb);
}
describe('map', () => {
    it('should respect identity', () => {
        fc.assert(fc.property(validatedGenerator(fc.anything()), function (v) {
            expect(validated_1.map(v, (x) => x)).toEqual(v);
        }));
    });
    it('should be associative', () => {
        fc.assert(fc.property(validatedGenerator(fc.float()), function (v) {
            const f1 = (x) => x + 1;
            const f2 = (x) => x * 2 + '';
            expect(validated_1.map(validated_1.map(v, f1), f2)).toEqual(validated_1.map(v, (x) => f2(f1(x))));
        }));
    });
    it('should do nothing with error', () => {
        fc.assert(fc.property(errArb, function (v) {
            expect(validated_1.map(v, () => {
                fail('should not be called');
            })).toEqual(v);
        }));
    });
    it('should transform values', () => {
        const f1 = (x) => x + 1;
        fc.assert(fc.property(fc.float(), function (v) {
            expect(validated_1.map(v, f1)).toEqual(f1(v));
        }));
    });
});
describe('flatMap', () => {
    it('should respect left identity', () => {
        fc.assert(fc.property(validatedGenerator(fc.float()), function (v) {
            expect(validated_1.flatMap(v, (x) => x)).toEqual(v);
        }));
    });
    it('should respect right identity', () => {
        fc.assert(fc.property(fc.float(), validatedGenerator(fc.float()), function (v, v2) {
            const f1 = (x) => validated_1.map(v2, (i) => x + i);
            expect(validated_1.flatMap(v, f1)).toEqual(f1(v));
        }));
    });
    it('should be associative', () => {
        fc.assert(fc.property(validatedGenerator(fc.float()), validatedGenerator(fc.float()), validatedGenerator(fc.string()), function (v, v2, v3) {
            const f1 = (x) => validated_1.map(v2, (i) => x + i);
            const f2 = (x) => validated_1.map(v3, (i) => x + i);
            expect(validated_1.flatMap(validated_1.flatMap(v, f1), f2)).toEqual(validated_1.flatMap(v, (x) => validated_1.flatMap(f1(x), f2)));
        }));
    });
    it('should do nothing with error', () => {
        fc.assert(fc.property(errArb, function (v) {
            expect(validated_1.flatMap(v, () => {
                fail('should not be called');
            })).toEqual(v);
        }));
    });
    it('should transform values', () => {
        const f1 = (x) => x + 1;
        fc.assert(fc.property(fc.float(), function (v) {
            expect(validated_1.flatMap(v, f1)).toEqual(f1(v));
        }));
    });
});
describe('zip', () => {
    it('should return the 2 values if no errors', () => {
        fc.assert(fc.property(fc.float(), fc.float(), function (x, y) {
            expect(validated_1.zip(x, y)).toEqual([x, y]);
        }));
    });
    it('should return the error if there is one error', () => {
        fc.assert(fc.property(errArb, fc.float(), function (err, y) {
            expect(validated_1.zip(err, y)).toEqual(err);
            expect(validated_1.zip(y, err)).toEqual(err);
        }));
    });
    it('should combine the errors if the 2 are errors', () => {
        fc.assert(fc.property(errArb, errArb, function (err, err2) {
            const result = validated_1.zip(err, err2);
            if (!validated_1.isError(result)) {
                fail(`${result} should be an error`);
            }
            else {
                expect(result.errors()).toEqual(err.errors().concat(err2.errors()));
            }
        }));
    });
});
describe('zip3', () => {
    it('should return the 2 values if no errors', () => {
        fc.assert(fc.property(fc.float(), fc.float(), fc.float(), function (x, y, z) {
            expect(validated_1.zip3(x, y, z)).toEqual([x, y, z]);
        }));
    });
    it('should return the error if there is one error', () => {
        fc.assert(fc.property(errArb, fc.float(), fc.float(), function (err, y, z) {
            expect(validated_1.zip3(err, y, z)).toEqual(err);
            expect(validated_1.zip3(y, err, z)).toEqual(err);
            expect(validated_1.zip3(y, z, err)).toEqual(err);
        }));
    });
    it('should combine the errors if the 2 are errors', () => {
        fc.assert(fc.property(errArb, errArb, fc.float(), function (err, err2, z) {
            const result = validated_1.zip3(err, z, err2);
            if (!validated_1.isError(result)) {
                fail(`${result} should be an error`);
            }
            else {
                expect(result.errors()).toEqual(err.errors().concat(err2.errors()));
            }
        }));
    });
    it('should combine the errors if the 3 are errors', () => {
        fc.assert(fc.property(errArb, errArb, errArb, function (err, err2, err3) {
            const result = validated_1.zip3(err, err2, err3);
            if (!validated_1.isError(result)) {
                fail(`${result} should be an error`);
            }
            else {
                expect(result.errors()).toEqual(err
                    .errors()
                    .concat(err2.errors())
                    .concat(err3.errors()));
            }
        }));
    });
});
