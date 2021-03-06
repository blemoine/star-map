import { isError, raise, Validated } from '../utils/validated';

declare class ParsecTag {
  private _kind: 'parsec';
}
export type Parsec = number & ParsecTag;

export function mkParsec(n: 0): Parsec;
export function mkParsec(n: 0.000001): Parsec;
export function mkParsec(n: 0.0001): Parsec;
export function mkParsec(n: 0.01): Parsec;
export function mkParsec(n: 0.003): Parsec;
export function mkParsec(n: 0.005): Parsec;
export function mkParsec(n: 1): Parsec;
export function mkParsec(n: 10): Parsec;
export function mkParsec(n: number): Validated<Parsec>;
export function mkParsec(n: number): Validated<Parsec> {
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

export function toLightYear(p: number): number {
  return p * 3.261;
}

export function toKm(p: Parsec): number {
  return p * 3.08567758e13;
}

export function minParsec(p1: Parsec, p2: Parsec): Parsec {
  return p1 < p2 ? p1 : p2;
}
