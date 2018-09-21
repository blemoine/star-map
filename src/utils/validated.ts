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

export function errorMap<A>(v: Validated<A>, fn: (e: ErrorUnit) => ErrorUnit): Validated<A> {
  if (isError(v)) {
    return v.map(fn);
  } else {
    return v;
  }
}

export function isError<A>(v: Validated<A>): v is Err {
  return v && (v as Err).kind === 'error';
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

export function getOrElse<A>(v: Validated<A>, orElse: A): A {
  if (isError(v)) {
    return orElse;
  } else {
    return v;
  }
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

export function zip4<A, B, C, D>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>
): Validated<[A, B, C, D]> {
  return map(zip(zip3(v1, v2, v3), v4), ([[a, b, c], d]): [A, B, C, D] => [a, b, c, d]);
}

export function zip5<A, B, C, D, E>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>
): Validated<[A, B, C, D, E]> {
  return map(zip(zip4(v1, v2, v3, v4), v5), ([[a, b, c, d], e]): [A, B, C, D, E] => [a, b, c, d, e]);
}

export function zip6<A, B, C, D, E, F>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>,
  v6: Validated<F>
): Validated<[A, B, C, D, E, F]> {
  return map(zip(zip5(v1, v2, v3, v4, v5), v6), ([[a, b, c, d, e], f]): [A, B, C, D, E, F] => [a, b, c, d, e, f]);
}

export function zip7<A, B, C, D, E, F, G>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>,
  v6: Validated<F>,
  v7: Validated<G>
): Validated<[A, B, C, D, E, F, G]> {
  return map(
    zip(zip6(v1, v2, v3, v4, v5, v6), v7),
    ([[a, b, c, d, e, f], g]): [A, B, C, D, E, F, G] => [a, b, c, d, e, f, g]
  );
}

export function zip8<A, B, C, D, E, F, G, H>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>,
  v6: Validated<F>,
  v7: Validated<G>,
  v8: Validated<H>
): Validated<[A, B, C, D, E, F, G, H]> {
  return map(
    zip(zip7(v1, v2, v3, v4, v5, v6, v7), v8),
    ([[a, b, c, d, e, f, g], h]): [A, B, C, D, E, F, G, H] => [a, b, c, d, e, f, g, h]
  );
}

export function zip9<A, B, C, D, E, F, G, H, I>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>,
  v6: Validated<F>,
  v7: Validated<G>,
  v8: Validated<H>,
  v9: Validated<I>
): Validated<[A, B, C, D, E, F, G, H, I]> {
  return map(
    zip(zip8(v1, v2, v3, v4, v5, v6, v7, v8), v9),
    ([[a, b, c, d, e, f, g, h], i]): [A, B, C, D, E, F, G, H, I] => [a, b, c, d, e, f, g, h, i]
  );
}

export function zip10<A, B, C, D, E, F, G, H, I, J>(
  v1: Validated<A>,
  v2: Validated<B>,
  v3: Validated<C>,
  v4: Validated<D>,
  v5: Validated<E>,
  v6: Validated<F>,
  v7: Validated<G>,
  v8: Validated<H>,
  v9: Validated<I>,
  v10: Validated<J>
): Validated<[A, B, C, D, E, F, G, H, I, J]> {
  return map(
    zip(zip9(v1, v2, v3, v4, v5, v6, v7, v8, v9), v10),
    ([[a, b, c, d, e, f, g, h, i], j]): [A, B, C, D, E, F, G, H, I, J] => [a, b, c, d, e, f, g, h, i, j]
  );
}
