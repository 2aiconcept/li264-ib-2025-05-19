// src/features/products/interfaces/product.interface.ts
import { STATE_PRODUCT } from "../enums/state-product.enum";

export interface IProduct {
  id: string;
  state: STATE_PRODUCT;
  ref: string;
  description: string;
}
