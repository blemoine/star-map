"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validated_1 = require("../../utils/validated");
function getOrThrow(v) {
    if (validated_1.isError(v)) {
        throw new Error(v.errors().join(','));
    }
    else {
        return v;
    }
}
exports.getOrThrow = getOrThrow;
