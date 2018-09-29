"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_helper_1 = require("../file.helper");
const validated_1 = require("../../utils/validated");
describe('readFile', () => {
    it('should return an error if the file does not exist', () => {
        return file_helper_1.readFile(__dirname + '/does.not.exist').then(() => fail('this call should fail'), (err) => {
            expect(validated_1.isError(err)).toBe(true);
        });
    });
    it('should return the file content if the file exist', () => {
        return file_helper_1.readFile(__dirname + '/../../../src/pre-computation/__tests__/file.to.load').then((result) => {
            expect(result).toBe('MOCK CONTENT');
        }, (err) => {
            fail(`this call should not fail with ${JSON.stringify(err)}`);
        });
    });
});
describe('parseToCsv', () => {
    it('should correctly parse a valid csv', () => {
        const result = file_helper_1.parseToCsv(`
HEAD1,HEAD2
1,2
3,4`.trim());
        expect(result).toEqual([{ HEAD1: '1', HEAD2: '2' }, { HEAD1: '3', HEAD2: '4' }]);
    });
    it('should return an error if the csv is invalid csv', () => {
        const result = file_helper_1.parseToCsv(`HEAD1,HEAD2
      1,2,3,4`);
        expect(validated_1.isError(result)).toBe(true);
    });
});
describe('parseJson', () => {
    it('should return an error if the string is not json', () => {
        expect(validated_1.isError(file_helper_1.parseJson(`test`, (x) => typeof x === 'string'))).toBe(true);
    });
    it('should return an error if the string is json but not valid', () => {
        expect(validated_1.isError(file_helper_1.parseJson(`"test"`, (x) => typeof x !== 'string'))).toBe(true);
    });
    it('should return the json if it is valid', () => {
        expect(file_helper_1.parseJson(`"test"`, (x) => typeof x === 'string')).toBe('test');
    });
});
