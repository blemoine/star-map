import { isError, raise, Validated } from '../utils/validated';

declare class ParsecTag {
  private _kind: 'parsec';
}
export type Parsec = number & ParsecTag;

export function mkParsec(n: 0): Parsec;
export function mkParsec(n: 0.01): Parsec;
export function mkParsec(n: 0.03): Parsec;
export function mkParsec(n: 1): Parsec;
export function mkParsec(n: 10): Parsec;
export function mkParsec(n: number): Validated<Parsec>;
export function mkParsec(n: number | 0 | 0.01 | 0.03 | 1 | 10): Validated<Parsec> {
  if (n < 0) {
    return raise(`Cannot transform ${n} to parsec, must be positive`);
  } else {
    return n as Parsec;
  }
}

export function add(p1: Parsec, p2: Parsec): Parsec {
  const r = mkParsec(p1 + p2);
  if (isError(r)) {
    throw new Error(`It cannot happen, as ${p1} and ${p2} are parsec, there sum IS positive`);
  }
  return r;
}
