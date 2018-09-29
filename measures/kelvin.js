"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../utils/validated");
function mkKelvin(n) {
    if (n < 0) {
        return validated_1.raise(`Cannot transform ${n} to kelvin, must be positive`);
    }
    else {
        return n;
    }
}
exports.mkKelvin = mkKelvin;
