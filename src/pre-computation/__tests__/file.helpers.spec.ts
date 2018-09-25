import { parseJson, parseToCsv, readFile } from '../file.helper';
import { isError } from '../../utils/validated';

describe('readFile', () => {
  it('should return an error if the file does not exist', () => {
    return readFile(__dirname + '/does.not.exist').then(
      () => fail('this call should fail'),
      (err) => {
        expect(isError(err)).toBe(true);
      }
    );
  });
  it('should return the file content if the file exist', () => {
    return readFile(__dirname + '/../../../src/pre-computation/__tests__/file.to.load').then(
      (result) => {
        expect(result).toBe('MOCK CONTENT');
      },
      (err) => {
        fail(`this call should not fail with ${JSON.stringify(err)}`);
      }
    );
  });
});

describe('parseToCsv', () => {
  it('should correctly parse a valid csv', () => {
    const result = parseToCsv(
      `
HEAD1,HEAD2
1,2
3,4`.trim()
    );

    expect(result).toEqual([{ HEAD1: '1', HEAD2: '2' }, { HEAD1: '3', HEAD2: '4' }]);
  });
  it('should return an error if the csv is invalid csv', () => {
    const result = parseToCsv(`HEAD1,HEAD2
      1,2,3,4`);

    expect(isError(result)).toBe(true);
  });
});

describe('parseJson', () => {
  it('should return an error if the string is not json', () => {
    expect(isError(parseJson<string>(`test`, (x): x is string => typeof x === 'string'))).toBe(true);
  });
  it('should return an error if the string is json but not valid', () => {
    expect(isError(parseJson<string>(`"test"`, (x): x is string => typeof x !== 'string'))).toBe(true);
  });
  it('should return the json if it is valid', () => {
    expect(parseJson<string>(`"test"`, (x): x is string => typeof x === 'string')).toBe('test');
  });
});
