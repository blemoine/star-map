
import { Kelvin } from '../measures/kelvin';
const SunTemp = 5500;
const absoluteMagnitudeSun = 4.85;
const SunRadius = 1 //TODO

export function computeRadius(temperature: Kelvin, absoluteMagnitude: number) {
  return (
    SunRadius *
    Math.pow(SunTemp / temperature, 2) *
    Math.sqrt(Math.pow(2.512, absoluteMagnitudeSun - absoluteMagnitude))
  );
}
