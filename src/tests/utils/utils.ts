import { isError, Validated } from '../../utils/validated';

export function getOrThrow<A>(v: Validated<A>): A {
  if (isError(v)) {
    throw new Error(v.errors().join(','));
  } else {
    return v;
  }
}
