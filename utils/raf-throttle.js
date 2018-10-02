"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rafThrottle(callback) {
    let requestId = null;
    const later = (...args) => () => {
        requestId = null;
        callback.apply(null, args);
    };
    return function (...args) {
        if (requestId === null) {
            requestId = requestAnimationFrame(later(...args));
        }
    };
}
exports.rafThrottle = rafThrottle;
