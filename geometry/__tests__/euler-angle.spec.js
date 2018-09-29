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
const euler_angle_1 = require("../euler-angle");
const arbitraries_1 = require("../../tests/utils/arbitraries");
describe('quaternion and euler angle', () => {
    it('should be the inverse of each other', () => {
        fc.assert(fc.property(arbitraries_1.arbitray.degree, arbitraries_1.arbitray.degree, arbitraries_1.arbitray.degree, function (a, b, c) {
            const degrees = [a, b, c];
            const result = euler_angle_1.quat2euler(euler_angle_1.euler2quat(degrees));
            expect(result.length).toBe(3);
            expect(result[0]).toBeCloseTo(degrees[0], 5);
            expect(result[1]).toBeCloseTo(degrees[1], 5);
            expect(result[2]).toBeCloseTo(degrees[2], 5);
        }));
    });
});
