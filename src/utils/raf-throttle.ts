
export function rafThrottle<P extends Array<any>, R>(callback: (...p: P) => R): (...p: P) => void {
  let requestId: number | null = null;

  const later = (...args: P) => () => {
    requestId = null;
    callback.apply(null, args);
  };

  return function(...args: P): void {
    if (requestId === null) {
      requestId = requestAnimationFrame(later(...args));
    }
  };
}
