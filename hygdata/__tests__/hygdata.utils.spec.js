"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const hygdata_utils_1 = require("../hygdata.utils");
const parsec_1 = require("../../measures/parsec");
const fc = __importStar(require("fast-check"));
const utils_1 = require("../../tests/utils/utils");
const arbitraries_1 = require("../../tests/utils/arbitraries");
const validated_1 = require("../../utils/validated");
const vectors_1 = require("../../geometry/vectors");
describe('moveOrigin', () => {
    it('should not do anthing if not moving', () => {
        const origin = [0, 0, 0];
        fc.assert(fc.property(fc.float(), fc.float(), fc.float(), fc.float(), function (apparentMagnitude, x, y, z) {
            const coordinates = [x, y, z];
            const star = {
                id: '123',
                name: 'test',
                coordinates: coordinates,
                distance: utils_1.getOrThrow(parsec_1.mkParsec(vectors_1.vectorLength(coordinates))),
                apparentMagnitude,
                color: [255, 255, 255],
                radius: null,
                bayer: null,
                flamsteed: null,
                constellation: 'test',
            };
            const result = hygdata_utils_1.moveOrigin(origin, star);
            if (validated_1.isError(result)) {
                return fail(`The result should be a star for inputs ${origin} and ${star}`);
            }
            expect(result.coordinates).toEqual(star.coordinates);
            expect(result.distance).toBeCloseTo(star.distance, 6);
            expect(result.apparentMagnitude).toBeCloseTo(star.apparentMagnitude, 6);
        }));
    });
    it('should substract distance if going in the original direction', () => {
        fc.assert(fc.property(fc.float().filter((i) => i > 0), arbitraries_1.arbitray.parsec, function (baseDistance, newCoord) {
            const coordinates = [baseDistance, 0, 0];
            const origin = [newCoord, 0, 0];
            const star = {
                id: '123',
                name: 'test',
                distance: utils_1.getOrThrow(parsec_1.mkParsec(Math.abs(baseDistance))),
                apparentMagnitude: 5,
                color: [255, 255, 255],
                radius: null,
                bayer: null,
                flamsteed: null,
                coordinates: coordinates,
                constellation: 'test',
            };
            const result = hygdata_utils_1.moveOrigin(origin, star);
            if (validated_1.isError(result)) {
                return fail(`The result should be a star for inputs ${origin} and ${star}`);
            }
            expect(result.coordinates[0]).toBe(baseDistance - newCoord);
            expect(result.coordinates[1]).toBe(0);
            expect(result.coordinates[2]).toBe(0);
            expect(result.distance).toBeCloseTo(Math.abs(baseDistance - newCoord), 6);
        }));
    });
});
