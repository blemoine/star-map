import { Parsec } from '../measures/parsec';

export function toApparentMagnitude(distance: Parsec, absoluteMagnitude: number): number {
  return absoluteMagnitude + 5.0 * Math.log10(distance) - 5.0;
}