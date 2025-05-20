export const total = (unit: number, coef: number, vat?: number): number => {
  if (typeof unit !== "number" || typeof coef !== "number") {
    return 0;
  } // typeof couvre null, undenifed, Nan, string

  const base = unit * coef;

  return typeof vat === "number" ? base * (1 + vat / 100) : base;
};
