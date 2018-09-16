import { convertToGeoJson } from '../hygdata';
import { isError, Validated } from '../../utils/validated';

function expectToBeError<A>(result: Validated<A>, messages: Array<string> = []): void {
  if (isError(result)) {
    messages.forEach((msg) => {
      const errors = result.errors();
      if (!errors.some((e) => e.message.indexOf(msg) >= 0)) {
        fail(`Cannot find '${msg}' in ${JSON.stringify(errors, null, 2)}`);
      }
    });
  } else {
    fail(`${JSON.stringify(result, null, 2)} must be errors`);
  }
}

describe('convertToGeoJson', () => {
  const headerRow = 'id,hip,hd,hr,gl,bf,proper,ra,dec,dist,pmra,pmdec,rv,mag,absmag,spect,ci,x,y,z,vx,vy,vz,rarad,decrad,pmrarad,pmdecrad,bayer,flam,con,comp,comp_primary,base,lum,var,var_min,var_max'.split(
    ','
  );
  const oneValidCsvRow = '676,677,358,15,,21Alp And,Alpheratz,0.139791,29.090432,29.7442,135.68,-162.95,-12.0,2.070,-0.297,B9p,-0.038,25.974572,0.951042,14.461264,-0.00000002,0.00001958,-0.00002650,0.03659716270801555,0.5077238184659449,0.0000006577952017777778,-0.000000790003892,Alp,21,And,1,676,,114.49855346901883,Alp,2.083,2.063'.split(
    ','
  );
  const oneRowWithHighMagnitude = '2076,2081,2261,99,,Alp Phe,Ankaa,0.438056,-42.305981,25.9740,232.76,-353.64,75.0,10.400,8.327,K0III...,1.083,19.083654,2.198282,-17.483284,0.00002323,0.00003218,-0.00008456,0.11468290295782503,-0.7383786688321162,0.000001128452322861111,-0.000001714495099,Alp,,Phe,1,2076,,64.44659847416881,,,'.split(
    ','
  );
  describe('header parsing', () => {
    it('should return an error if there is no "proper" header ', () => {
      const result = convertToGeoJson([oneValidCsvRow]);

      expectToBeError(result, [`proper header was not found in the list of headers`]);
    });
    it('should return an error if there is no "mag" header ', () => {
      const result = convertToGeoJson([oneValidCsvRow]);

      expectToBeError(result, [`mag header was not found in the list of headers`]);
    });
    it('should return an error if there is no "dist" header ', () => {
      const result = convertToGeoJson([oneValidCsvRow]);

      expectToBeError(result, [`dist header was not found in the list of headers`]);
    });
    it('should return an error if there is no "ra" header ', () => {
      const result = convertToGeoJson([oneValidCsvRow]);

      expectToBeError(result, [`ra header was not found in the list of headers`]);
    });
    it('should return an error if there is no "dec" header ', () => {
      const result = convertToGeoJson([oneValidCsvRow]);

      expectToBeError(result, [`dec header was not found in the list of headers`]);
    });
  });

  describe('parsing', () => {
    it('invert longitude coordinate', () => {
      const result = convertToGeoJson([headerRow, oneRowWithHighMagnitude]);
      if (isError(result)) {
        throw new Error(`${result} should not be an error`);
      }
      expect(result.features).toEqual([
        {
          geometry: {
            coordinates: [-6.5708400000000005, -42.305981],
            type: 'Point',
          },
          id: '2076',
          properties: {
            dec: -42.305981,
            ra: 0.438056,
            distance: 25.974,
            apparentMagnitude: 10.4,
            name: 'Ankaa',
            color: [255, 227, 190],
          },
          type: 'Feature',
        },
      ]);
    });
  });
});
