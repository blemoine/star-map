"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsec_1 = require("../../measures/parsec");
const utils_1 = require("../../tests/utils/utils");
const constellations_helpers_1 = require("../constellations.helpers");
const validated_1 = require("../../utils/validated");
describe('constellationAsStarId', () => {
    const stars = {
        '112601': {
            id: '112601',
            name: '',
            bayer: 'lambda',
            flamsteed: '15',
            constellation: 'aqr',
            color: [255, 198, 118],
            distance: utils_1.getOrThrow(parsec_1.mkParsec(118.0638)),
            apparentMagnitude: 3.73,
            radius: utils_1.getOrThrow(parsec_1.mkParsec(0.000001223435776852617)),
            coordinates: [112.009754, -33.916636, -15.573012],
        },
        '114670': {
            id: '114670',
            name: '',
            bayer: 'psi-2',
            flamsteed: '23',
            constellation: 'aqr',
            color: [170, 191, 255],
            distance: utils_1.getOrThrow(parsec_1.mkParsec(123.1527)),
            apparentMagnitude: 4.41,
            radius: utils_1.getOrThrow(parsec_1.mkParsec(2.863916287468094e-8)),
            coordinates: [119.529341, -22.20547, -19.652688],
        },
    };
    it('should return an error if one star is not found', () => {
        const result = constellations_helpers_1.constellationAsStarId(stars, [['AQR', 'lambda'], ['ORI', 'pi-2']]);
        if (validated_1.isError(result)) {
            expect(result.errors().length).toEqual(1);
        }
        else {
            fail(`${result} should be an error`);
        }
    });
    it('should return an error if one star is not found even approximately', () => {
        const result = constellations_helpers_1.constellationAsStarId(stars, [['AQR', 'lambda'], ['AQR', 'eta']]);
        if (validated_1.isError(result)) {
            expect(result.errors().length).toEqual(1);
        }
        else {
            fail(`${result} should be an error`);
        }
    });
    it('should return the constellation ids', () => {
        const result = constellations_helpers_1.constellationAsStarId(stars, [['AQR', 'lambda'], ['AQR', 'psi']]);
        if (validated_1.isError(result)) {
            fail(`${result} should not be an error`);
        }
        else {
            expect(result).toEqual(['112601', '114670']);
        }
    });
});
describe('convertStarNameToFullName', () => {
    it('should convert simple name to long name', () => {
        expect(constellations_helpers_1.convertStarNameToFullName('ALP')).toBe('alpha');
        expect(constellations_helpers_1.convertStarNameToFullName('EPS')).toBe('epsilon');
    });
    it('should convert correct short name to correct short name', () => {
        expect(constellations_helpers_1.convertStarNameToFullName('PI')).toBe('pi');
        expect(constellations_helpers_1.convertStarNameToFullName('MU')).toBe('mu');
    });
    it('should convert composed name to correct composed name', () => {
        expect(constellations_helpers_1.convertStarNameToFullName('NU-2')).toBe('nu-2');
        expect(constellations_helpers_1.convertStarNameToFullName('DEL-14')).toBe('delta-14');
    });
    it('should lower case unknown name', () => {
        expect(constellations_helpers_1.convertStarNameToFullName('TEST')).toBe('test');
    });
});
describe('validateConstellationJson', () => {
    it('should return true for a valid constellation structures', () => {
        expect(constellations_helpers_1.validateConstellationJson([
            [['ORI', 'zeta'], ['ORI', 'epsilon'], ['ORI', 'delta']],
            [['ARI', 'gamma'], ['ARI', 'beta'], ['ARI', 'alpha'], ['ARI', '41']],
        ])).toBe(true);
    });
    it('should return false if not a valid constellation structure', () => {
        expect(constellations_helpers_1.validateConstellationJson(null)).toBe(false);
        expect(constellations_helpers_1.validateConstellationJson({})).toBe(false);
        expect(constellations_helpers_1.validateConstellationJson([{}])).toBe(false);
        expect(constellations_helpers_1.validateConstellationJson([[['ORI', 'zeta'], ['ORI', 'epsilon'], ['ORI', 'delta', 'da']]])).toBe(false);
    });
});
describe('optimizeConstellation', () => {
    it('should optimize one constellation', () => {
        const uma = [
            [
                ['UMA', 'eta'],
                ['UMA', 'zeta'],
                ['UMA', 'epsilon'],
                ['UMA', 'delta'],
                ['UMA', 'alpha'],
                ['UMA', '23'],
                ['UMA', 'omicron'],
                ['UMA', 'upsilon'],
                ['UMA', 'beta'],
                ['UMA', 'gamma'],
                ['UMA', 'delta'],
            ],
            [['UMA', 'beta'], ['UMA', 'alpha']],
            [['UMA', 'upsilon'], ['UMA', 'theta'], ['UMA', 'iota'], ['UMA', 'kappa']],
            [['UMA', 'gamma'], ['UMA', 'chi'], ['UMA', 'nu'], ['UMA', 'xi']],
            [['UMA', 'chi'], ['UMA', 'psi'], ['UMA', 'mu'], ['UMA', 'lambda']],
        ];
        const result = constellations_helpers_1.optimizeConstellation(uma);
        expect(result).toEqual([
            [
                ['UMA', 'eta'],
                ['UMA', 'zeta'],
                ['UMA', 'epsilon'],
                ['UMA', 'delta'],
                ['UMA', 'alpha'],
                ['UMA', '23'],
                ['UMA', 'omicron'],
                ['UMA', 'upsilon'],
                ['UMA', 'beta'],
                ['UMA', 'alpha'],
                ['UMA', 'beta'],
                ['UMA', 'upsilon'],
                ['UMA', 'theta'],
                ['UMA', 'iota'],
                ['UMA', 'kappa'],
                ['UMA', 'iota'],
                ['UMA', 'theta'],
                ['UMA', 'upsilon'],
                ['UMA', 'beta'],
                ['UMA', 'gamma'],
                ['UMA', 'delta'],
                ['UMA', 'gamma'],
                ['UMA', 'beta'],
                ['UMA', 'upsilon'],
                ['UMA', 'theta'],
                ['UMA', 'iota'],
                ['UMA', 'theta'],
                ['UMA', 'upsilon'],
                ['UMA', 'beta'],
                ['UMA', 'gamma'],
                ['UMA', 'chi'],
                ['UMA', 'nu'],
                ['UMA', 'xi'],
                ['UMA', 'nu'],
                ['UMA', 'chi'],
                ['UMA', 'psi'],
                ['UMA', 'mu'],
                ['UMA', 'lambda'],
                ['UMA', 'mu'],
                ['UMA', 'psi'],
                ['UMA', 'chi'],
                ['UMA', 'nu'],
                ['UMA', 'chi'],
                ['UMA', 'psi'],
                ['UMA', 'mu'],
            ],
        ]);
    });
});
