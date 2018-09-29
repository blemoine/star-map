"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyg_csv_helpers_1 = require("../hyg-csv.helpers");
const validated_1 = require("../../utils/validated");
describe('rowsToStars', () => {
    const alpheratz = {
        id: '676',
        proper: 'Alpheratz',
        ra: '0.139791',
        dec: '29.090432',
        dist: '29.7442',
        mag: '2.070',
        spect: 'B9p',
        x: '25.97457',
        y: '0.951042',
        z: '14.461264',
        bayer: 'Alp',
        flam: '21',
        con: 'And',
    };
    it('should return the expected starsm with magnitude more than 6', () => {
        const rows = [alpheratz, Object.assign({}, alpheratz, { id: '1', mag: '14' })];
        const result = hyg_csv_helpers_1.rowsToStars(10, rows);
        expect(result).toEqual({
            '676': {
                apparentMagnitude: 2.07,
                bayer: 'alpha',
                flamsteed: '21',
                color: [255, 255, 255],
                constellation: 'and',
                coordinates: [25.97457, 0.951042, 14.461264],
                distance: 29.7442,
                id: '676',
                name: 'Alpheratz',
                radius: 5.321278590462636e-8,
            },
        });
    });
    it('should return an error if there is one error', () => {
        const rows = [alpheratz, Object.assign({}, alpheratz, { id: '1', mag: 'abc' })];
        const result = hyg_csv_helpers_1.rowsToStars(10, rows);
        expect(validated_1.isError(result)).toEqual(true);
    });
});
