import { flatMap, isError, map, raise, sequence, Validated, zip, zip3 } from '../validated';
import * as fc from 'fast-check';

describe('isError', () => {
  it('raise should be an error', () => {
    const e = raise('An error');
    expect(isError(e)).toBe(true);
  });
  it('should not be an error if raise is not used', () => {
    fc.assert(
      fc.property(fc.anything(), function(a: any) {
        expect(isError(a)).toBe(false);
      })
    );
  });
});

describe('sequence', () => {
  it('should invert Array and Success if there is no error', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), function(a: Array<any>) {
        const b: Validated<Array<any>> = sequence(a);
        expect(b).toEqual(a);
      })
    );
  });

  it('should accumulate the error', () => {
    const err1 = raise('error1');
    const err2 = raise('error2');
    const a: Array<Validated<number>> = [1, err1, 2, err2];
    const result: Validated<Array<number>> = sequence(a);

    if (!isError(result)) {
      fail(`${result} should be an error`);
    } else {
      expect(result.errors()).toEqual(err1.errors().concat(err2.errors()));
    }
  });
});

const errArb: fc.Arbitrary<Validated<any>> = fc.string().map((str) => raise(str));
function validatedGenerator<A>(arb: fc.Arbitrary<A>): fc.Arbitrary<Validated<A>> {
  return fc.oneof(arb, errArb);
}
describe('map', () => {
  it('should respect identity', () => {
    fc.assert(
      fc.property(validatedGenerator(fc.anything()), function(v: Validated<any>) {
        expect(map(v, (x) => x)).toEqual(v);
      })
    );
  });

  it('should be associative', () => {
    fc.assert(
      fc.property(
        validatedGenerator(fc.float()),
        fc.func<[number], number>(fc.float()),
        fc.func<[number], string>(fc.string()),
        function(v: Validated<number>, f1, f2) {
          expect(map(map(v, f1), f2)).toEqual(map(v, (x) => f2(f1(x))));
        }
      )
    );
  });

  it('should do nothing with error', () => {
    fc.assert(
      fc.property(errArb, function(v: Validated<any>) {
        expect(
          map(v, () => {
            fail('should not be called');
          })
        ).toEqual(v);
      })
    );
  });

  it('should transform values', () => {
    fc.assert(
      fc.property(fc.float(), fc.func<[number], number>(fc.float()), function(v: number, f1) {
        expect(map(v, f1)).toEqual(f1(v));
      })
    );
  });
});

describe('flatMap', () => {
  it('should respect left identity', () => {
    fc.assert(
      fc.property(validatedGenerator(fc.float()), function(v: Validated<number>) {
        expect(flatMap(v, (x) => x)).toEqual(v);
      })
    );
  });

  it('should respect right identity', () => {
    fc.assert(
      fc.property(fc.float(), validatedGenerator(fc.float()), function(v: number, v2: Validated<number>) {
        const f1 = (x: number): Validated<number> => map(v2, (i) => x + i);

        expect(flatMap(v, f1)).toEqual(f1(v));
      })
    );
  });

  it('should be associative', () => {
    fc.assert(
      fc.property(
        validatedGenerator(fc.float()),
        validatedGenerator(fc.float()),
        validatedGenerator(fc.string()),
        function(v: Validated<number>, v2: Validated<number>, v3: Validated<string>) {
          const f1 = (x: number): Validated<number> => map(v2, (i) => x + i);
          const f2 = (x: number): Validated<string> => map(v3, (i) => x + i);

          expect(flatMap(flatMap(v, f1), f2)).toEqual(flatMap(v, (x) => flatMap(f1(x), f2)));
        }
      )
    );
  });

  it('should do nothing with error', () => {
    fc.assert(
      fc.property(errArb, function(v: Validated<any>) {
        expect(
          flatMap(v, () => {
            fail('should not be called');
          })
        ).toEqual(v);
      })
    );
  });

  it('should transform values', () => {
    const f1 = (x: number): number => x + 1;
    fc.assert(
      fc.property(fc.float(), function(v: number) {
        expect(flatMap(v, f1)).toEqual(f1(v));
      })
    );
  });
});

describe('zip', () => {
  it('should return the 2 values if no errors', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), function(x: Validated<number>, y: Validated<number>) {
        expect(zip(x, y)).toEqual([x, y]);
      })
    );
  });
  it('should return the error if there is one error', () => {
    fc.assert(
      fc.property(errArb, fc.float(), function(err: Validated<number>, y: Validated<number>) {
        expect(zip(err, y)).toEqual(err);
        expect(zip(y, err)).toEqual(err);
      })
    );
  });
  it('should combine the errors if the 2 are errors', () => {
    fc.assert(
      fc.property(errArb, errArb, function(err: Validated<number>, err2: Validated<number>) {
        const result = zip(err, err2);
        if (!isError(result)) {
          fail(`${result} should be an error`);
        } else {
          expect(result.errors()).toEqual((err as any).errors().concat((err2 as any).errors()));
        }
      })
    );
  });
});

describe('zip3', () => {
  it('should return the 2 values if no errors', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), fc.float(), function(
        x: Validated<number>,
        y: Validated<number>,
        z: Validated<number>
      ) {
        expect(zip3(x, y, z)).toEqual([x, y, z]);
      })
    );
  });
  it('should return the error if there is one error', () => {
    fc.assert(
      fc.property(errArb, fc.float(), fc.float(), function(
        err: Validated<number>,
        y: Validated<number>,
        z: Validated<number>
      ) {
        expect(zip3(err, y, z)).toEqual(err);
        expect(zip3(y, err, z)).toEqual(err);
        expect(zip3(y, z, err)).toEqual(err);
      })
    );
  });
  it('should combine the errors if the 2 are errors', () => {
    fc.assert(
      fc.property(errArb, errArb, fc.float(), function(
        err: Validated<number>,
        err2: Validated<number>,
        z: Validated<number>
      ) {
        const result = zip3(err, z, err2);
        if (!isError(result)) {
          fail(`${result} should be an error`);
        } else {
          expect(result.errors()).toEqual((err as any).errors().concat((err2 as any).errors()));
        }
      })
    );
  });
  it('should combine the errors if the 3 are errors', () => {
    fc.assert(
      fc.property(errArb, errArb, errArb, function(
        err: Validated<number>,
        err2: Validated<number>,
        err3: Validated<number>
      ) {
        const result = zip3(err, err2, err3);
        if (!isError(result)) {
          fail(`${result} should be an error`);
        } else {
          expect(result.errors()).toEqual(
            (err as any)
              .errors()
              .concat((err2 as any).errors())
              .concat((err3 as any).errors())
          );
        }
      })
    );
  });
});
