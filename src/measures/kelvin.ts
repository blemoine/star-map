import { raise, Validated } from '../utils/validated';

declare class KelvinTag {
  private _kind: 'kelvin';
}
export type Kelvin = number & KelvinTag;

export function mkKelvin(n: 0): Kelvin;
export function mkKelvin(n: 1): Kelvin;
export function mkKelvin(n: 10): Kelvin;
export function mkKelvin(n: number): Validated<Kelvin>;
export function mkKelvin(n: number | 0 | 1 | 10): Validated<Kelvin> {
  if (n < 0) {
    return raise(`Cannot transform ${n} to kelvin, must be positive`);
  } else {
    return n as Kelvin;
  }
}
