type ErrorUnit = {
  message: string;
  context?: {};
};
class Err {
  public readonly kind: 'error' = 'error';
  constructor(private headErrors: ErrorUnit, private otherErrors: Array<ErrorUnit>) {}

  errors(): Array<ErrorUnit> {
    return [this.headErrors, ...this.otherErrors];
  }

  combine(err: Err): Err {
    return new Err(this.headErrors, [...this.otherErrors, ...err.errors()]);
  }

  map(fn: (e: ErrorUnit) => ErrorUnit): Err {
    return new Err(fn(this.headErrors), this.otherErrors.map(fn));
  }
}
export type Validated<A> = A | Err;

export function raise(message: string, context?: {}): Err {
  return new Err({ message, context }, []);
}

export function isError<A>(v: Validated<A>): v is Err {
  return !!v && (v as Err).kind === 'error';
}

export function sequence<A>(arr: Array<Validated<A>>): Validated<Array<A>> {
  return arr.reduce((v1: Validated<Array<A>>, v2) => {
    if (isError(v1) && isError(v2)) {
      return v1.combine(v2);
    } else if (isError(v1)) {
      return v1;
    } else if (isError(v2)) {
      return v2;
    } else {
      v1.push(v2);
      return v1;
    }
  }, []);
}

export function map<A, B>(v: Validated<A>, fn: (a: A) => B): Validated<B> {
  if (isError(v)) {
    return v;
  } else {
    return fn(v);
  }
}

export function flatMap<A, B>(v: Validated<A>, fn: (a: A) => Validated<B>): Validated<B> {
  if (isError(v)) {
    return v;
  } else {
    return fn(v);
  }
}

export function zip<A, B>(v1: Validated<A>, v2: Validated<B>): Validated<[A, B]> {
  if (isError(v1) && isError(v2)) {
    return v1.combine(v2);
  } else if (isError(v1)) {
    return v1;
  } else if (isError(v2)) {
    return v2;
  } else {
    return [v1, v2];
  }
}

export function zip3<A, B, C>(v1: Validated<A>, v2: Validated<B>, v3: Validated<C>): Validated<[A, B, C]> {
  return map(zip(zip(v1, v2), v3), ([[a, b], c]): [A, B, C] => [a, b, c]);
}
