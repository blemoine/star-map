"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fc = __importStar(require("fast-check"));
const number_1 = require("../number");
const validated_1 = require("../validated");
describe('fastAtan2', () => {
    it('should give a result equal to atan2m rounded at 3', () => {
        fc.assert(fc.property(fc.float(), fc.float(), function (a, b) {
            expect(number_1.fastAtan2(a, b)).toBeCloseTo(Math.atan2(a, b), 2);
        }));
    });
    it('should return the correct value for 0,0', () => {
        expect(number_1.fastAtan2(0, 0)).toBe(0);
    });
});
describe('fastAsin', () => {
    it('should give a result equal to atan2m rounded at 3', () => {
        fc.assert(fc.property(fc.float(-Math.PI / 2, Math.PI / 2), function (a) {
            const actual = number_1.fastAsin(a);
            if (Number.isNaN(actual)) {
                expect(actual).toEqual(Math.asin(a));
            }
            else {
                expect(actual).toBeCloseTo(Math.asin(a), 2);
            }
        }));
    });
});
describe('parseToFloat', () => {
    it('should fail if the string is not a number', () => {
        const result = number_1.parseToFloat('toto');
        expect(validated_1.isError(result)).toBe(true);
    });
    it('should return the value if the string is a number', () => {
        fc.assert(fc.property(fc.float(), (n) => {
            const result = number_1.parseToFloat(n + '');
            expect(result).toBe(n);
        }));
    });
});
