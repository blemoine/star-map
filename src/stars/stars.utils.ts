import { Kelvin } from '../measures/kelvin';
import { mkParsec, Parsec } from '../measures/parsec';
import { Validated } from '../utils/validated';
const SunTemp = 5500;
const absoluteMagnitudeSun = 4.85;
const SunRadius = 2.25398792e-8;

export function computeRadius(temperature: Kelvin, absoluteMagnitude: number): Validated<Parsec> {
  return mkParsec(
    SunRadius *
      Math.pow(SunTemp / temperature, 2) *
      Math.sqrt(Math.pow(2.512, absoluteMagnitudeSun - absoluteMagnitude))
  );
}
