"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hygdata_1 = require("../hygdata");
const validated_1 = require("../../utils/validated");
const utils_1 = require("../../tests/utils/utils");
const parsec_1 = require("../../measures/parsec");
describe('convertToGeoJson', () => {
    describe('parsing', () => {
        it('invert longitude coordinate', () => {
            const result = hygdata_1.convertToGeoJson({
                2076: {
                    apparentMagnitude: 10.4,
                    bayer: 'alp',
                    flamsteed: '1',
                    constellation: 'phe',
                    color: [255, 227, 190],
                    distance: utils_1.getOrThrow(parsec_1.mkParsec(25.974)),
                    id: '2076',
                    name: 'Ankaa',
                    coordinates: [19.083654, 2.198282, -17.483284],
                    radius: utils_1.getOrThrow(parsec_1.mkParsec(8.121814873393534e-9)),
                },
            });
            if (validated_1.isError(result)) {
                throw new Error(`${result} should not be an error`);
            }
            expect(result.features).toEqual([
                {
                    geometry: { coordinates: [-6.5710427108462115, -42.305928475316286], type: 'Point' },
                    id: '2076',
                    properties: {
                        apparentMagnitude: 10.4,
                        bayer: 'alp',
                        flamsteed: '1',
                        constellation: 'phe',
                        color: [255, 227, 190],
                        distance: 25.974,
                        id: '2076',
                        name: 'Ankaa',
                        coordinates: [19.083654, 2.198282, -17.483284],
                        radius: 8.121814873393534e-9,
                    },
                    type: 'Feature',
                },
            ]);
        });
    });
});
