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
const arbitraries_1 = require("../../tests/utils/arbitraries");
const parsec_1 = require("../parsec");
const validated_1 = require("../../utils/validated");
describe('mkParsec', () => {
    it('should return an error if the number is negative', () => {
        fc.assert(fc.property(fc.float(1, 100000000), function (a) {
            expect(validated_1.isError(parsec_1.mkParsec(-a))).toBe(true);
        }));
    });
});
describe('add', () => {
    it('should add 2 parsec as if they were 2 numbers', () => {
        fc.assert(fc.property(arbitraries_1.arbitray.parsec, arbitraries_1.arbitray.parsec, function (a, b) {
            expect(parsec_1.add(a, b)).toBe(a + b);
        }));
    });
});
