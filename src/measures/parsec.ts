import { raise, Validated } from '../utils/validated';

declare class ParsecTag {
  private _kind: 'parsec';
}
export type Parsec = number & ParsecTag;

export function mkParsec(n: 0): Parsec;
export function mkParsec(n: 1): Parsec;
export function mkParsec(n: 10): Parsec;
export function mkParsec(n: number): Validated<Parsec>;
export function mkParsec(n: number | 0 | 1 | 10): Validated<Parsec> {
  if (n < 0) {
    return raise(`Cannot transform ${n} to parsec, must be positive`);
  } else {
    return n as Parsec;
  }
}
