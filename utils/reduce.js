"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncCancellableReduce(arr, reducer, init, cancelPromise) {
    const bufferSize = 500;
    return new Promise((resolve, reject) => {
        let idx = 0;
        let result = init;
        const intervalId = setInterval(() => {
            for (let i = 0; i < bufferSize; ++i) {
                const newIdx = i + idx;
                if (newIdx < arr.length) {
                    result = reducer(result, arr[newIdx]);
                }
                else {
                    clearInterval(intervalId);
                    resolve(result);
                }
            }
            idx += bufferSize;
        });
        cancelPromise
            .catch((e) => {
            console.error('The cancel promise should not be resolved with an error', e);
        })
            .then(() => {
            clearInterval(intervalId);
            reject('Promise was canceled');
        });
    });
}
exports.asyncCancellableReduce = asyncCancellableReduce;
