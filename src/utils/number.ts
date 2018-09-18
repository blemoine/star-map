export const round = (num: number, precision: number = 2) => {
  const exp = Math.pow(10, precision);
  return Math.round(num * exp) / exp;
};
