import * as fs from 'fs';
import { raise, Validated } from '../utils/validated';
import { parse } from 'papaparse';

export function readFile(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, content) => {
      if (err) {
        reject(raise(`Could not read file ${fileName} with error ${err}`, { error: err }));
      } else {
        resolve(content);
      }
    });
  });
}

export function parseToCsv<A>(str: string): Validated<Array<A>> {
  const parsed = parse(str, { header: true, trimHeaders: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    return raise('Cannot convert the file to csv', { errors: parsed.errors });
  }
  return parsed.data;
}

export function parseJson<A>(str: string, validator: (a: unknown) => a is A): Validated<A> {
  try {
    const result: unknown = JSON.parse(str);
    if (validator(result)) {
      return result;
    } else {
      return raise(`The JSON ${str} is not parsable as specified type`, { json: str });
    }
  } catch (e) {
    return raise(`The JSON ${str} is not parsable as JSON`, { json: str });
  }
}
