"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spectral_types_informations_1 = require("../spectral-types-informations");
describe('findTemperatureOf', function () {
    it('should return the temperature of the sun', () => {
        expect(spectral_types_informations_1.findTemperatureOf('G2V')).toBe(5780);
    });
    it('should return the temperature of sirius', () => {
        expect(spectral_types_informations_1.findTemperatureOf('A0m..')).toBe(9900);
    });
});
