export enum STATE_PRODUCT {
  INACTIVE = 0,
  ACTIVE = 1,
}

// labels associés (facultatif pour le select)
export const STATE_PRODUCT_LABELS = {
  [STATE_PRODUCT.INACTIVE]: "Inactive",
  [STATE_PRODUCT.ACTIVE]: "Active",
};

// donne ceci :
// {
//   0: "Inactive",
//   1: "Active",
// }
