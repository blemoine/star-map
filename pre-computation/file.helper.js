"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const validated_1 = require("../utils/validated");
const papaparse_1 = require("papaparse");
function readFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, content) => {
            if (err) {
                reject(validated_1.raise(`Could not read file ${fileName} with error ${err}`, { error: err }));
            }
            else {
                resolve(content);
            }
        });
    });
}
exports.readFile = readFile;
function parseToCsv(str) {
    const parsed = papaparse_1.parse(str, { header: true, trimHeaders: true, skipEmptyLines: true });
    if (parsed.errors.length > 0) {
        return validated_1.raise('Cannot convert the file to csv', { errors: parsed.errors });
    }
    return parsed.data;
}
exports.parseToCsv = parseToCsv;
function parseJson(str, validator) {
    try {
        const result = JSON.parse(str);
        if (validator(result)) {
            return result;
        }
        else {
            return validated_1.raise(`The JSON ${str} is not parsable as specified type`, { json: str });
        }
    }
    catch (e) {
        return validated_1.raise(`The JSON ${str} is not parsable as JSON`, { json: str });
    }
}
exports.parseJson = parseJson;
