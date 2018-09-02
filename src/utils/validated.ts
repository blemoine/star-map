class Err {
  public readonly kind: 'error' = 'error';
  constructor(private headErrors: string, private otherErrors: Array<string>) {}

  errors(): Array<string> {
    return [this.headErrors, ...this.otherErrors];
  }
}
export type Validated<A> = A | Err;

export function raise(e: string): Err {
  return new Err(e, []);
}

export function isError<A>(v: Validated<A>): v is Err {
  return v && (v as Err).kind === 'error';
}

export function map<A, B>( v: Validated<A>, fn: (a: A) => B): Validated<B> {
  if (isError(v)) {
    return v;
  } else {
    return fn(v);
  }
}

export function flatMap<A, B>( v: Validated<A>, fn: (a: A) => Validated<B>): Validated<B> {
  if (isError(v)) {
    return v;
  } else {
    return fn(v);
  }
}

