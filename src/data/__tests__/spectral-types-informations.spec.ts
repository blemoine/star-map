import { findTemperatureOf } from '../spectral-types-informations';

describe('findTemperatureOf', function() {
  it('should return the temperature of the sun', () => {
    expect(findTemperatureOf('G2V')).toBe(5500);
  });
  it('should return the temperature of sirius', () => {
    expect(findTemperatureOf('A0m..')).toBe(9400);
  });
});
