"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const coordinates_1 = require("../coordinates");
const fc = __importStar(require("fast-check"));
const arbitraries_1 = require("../../tests/utils/arbitraries");
const validated_1 = require("../../utils/validated");
describe('lonlat2xyz and xyzToLonLat', () => {
    it('should be invert', () => {
        fc.assert(fc.property(arbitraries_1.arbitray.longitude, arbitraries_1.arbitray.latitude, function (longitude, latitude) {
            const input = [longitude, latitude];
            const result = coordinates_1.xyzToLonLat(coordinates_1.lonlat2xyz(input));
            if (validated_1.isError(result)) {
                return fail(`For input ${input}, to result valid were generated, ` + JSON.stringify(result));
            }
            expect(result.length).toEqual(2);
            expect(result[0]).toBeCloseTo(input[0], 2);
            expect(result[1]).toBeCloseTo(input[1], 2);
        }));
    });
});
