import { RawHygCsvRow, rowsToStars } from '../hyg-csv.helpers';
import { isError } from '../../utils/validated';

describe('rowsToStars', () => {
  const alpheratz: RawHygCsvRow = {
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
    const rows: Array<RawHygCsvRow> = [alpheratz, { ...alpheratz, id: '1', mag: '14' }];
    const result = rowsToStars(10, rows);

    expect(result).toEqual([{
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
    ]);
  });
  it('should return an error if there is one error', () => {
    const rows: Array<RawHygCsvRow> = [alpheratz, { ...alpheratz, id: '1', mag: 'abc' }];
    const result = rowsToStars(10, rows);

    expect(isError(result)).toEqual(true);
  });
});
