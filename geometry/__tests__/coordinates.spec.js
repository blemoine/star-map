"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../tests/utils/utils");
const coordinates_1 = require("../coordinates");
const fc = __importStar(require("fast-check"));
const arbitraries_1 = require("../../tests/utils/arbitraries");
const validated_1 = require("../../utils/validated");
describe('coordinates', () => {
    it('should convert center to center', () => {
        const ra = utils_1.getOrThrow(coordinates_1.mkRightAscension(0));
        const dec = utils_1.getOrThrow(coordinates_1.mkLatitude(0));
        expect(coordinates_1.decRaToGeo([dec, ra])).toEqual([0, 0]);
    });
    it('should convert 12 to 180', () => {
        const ra = utils_1.getOrThrow(coordinates_1.mkRightAscension(12));
        const dec = utils_1.getOrThrow(coordinates_1.mkLatitude(10));
        expect(coordinates_1.decRaToGeo([dec, ra])).toEqual([180, 10]);
    });
    it('should convert 23 to -15', () => {
        const ra = utils_1.getOrThrow(coordinates_1.mkRightAscension(23));
        const dec = utils_1.getOrThrow(coordinates_1.mkLatitude(-22));
        expect(coordinates_1.decRaToGeo([dec, ra])).toEqual([-15, -22]);
    });
    it('should convert 13 to -165', () => {
        const ra = utils_1.getOrThrow(coordinates_1.mkRightAscension(13));
        const dec = utils_1.getOrThrow(coordinates_1.mkLatitude(-88));
        expect(coordinates_1.decRaToGeo([dec, ra])).toEqual([-165, -88]);
    });
});
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
describe('geoToDecRa and decRaToGeo', () => {
    it('should be invert', () => {
        fc.assert(fc.property(arbitraries_1.arbitray.longitude, arbitraries_1.arbitray.latitude, function (longitude, latitude) {
            const input = [longitude, latitude];
            const result = validated_1.flatMap(coordinates_1.geoToDecRa(input), coordinates_1.decRaToGeo);
            if (validated_1.isError(result)) {
                return fail(`For input ${input}, to result valid were generated, ` + result);
            }
            expect(result.length).toEqual(2);
            expect(result[0]).toBeCloseTo(input[0], 5);
            expect(result[1]).toBeCloseTo(input[1], 5);
        }));
    });
});
