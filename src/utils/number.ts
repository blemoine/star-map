export const round = (num: number, precision: number = 2) => {
  const exp = Math.pow(10, precision);
  return Math.round(num * exp) / exp;
};

//http://developer.download.nvidia.com/cg/atan2.html
export function fastAtan2(y: number, x: number): number {
  let t0, t1, t3, t4;

  t3 = Math.abs(x);
  t1 = Math.abs(y);
  t0 = Math.max(t3, t1);
  t1 = Math.min(t3, t1);
  t3 = 1 / t0;
  t3 = t1 * t3;

  t4 = t3 * t3;
  t0 = -0.01348047;
  t0 = t0 * t4 + 0.057477314;
  t0 = t0 * t4 - 0.121239071;
  t0 = t0 * t4 + 0.195635925;
  t0 = t0 * t4 - 0.332994597;
  t0 = t0 * t4 + 0.99999563;
  t3 = t0 * t3;

  t3 = Math.abs(y) > Math.abs(x) ? 1.570796327 - t3 : t3;
  t3 = x < 0 ? 3.141592654 - t3 : t3;
  t3 = y < 0 ? -t3 : t3;

  return t3;
}
