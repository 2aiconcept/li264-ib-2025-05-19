// src/features/products/models/product.model.ts
import { STATE_PRODUCT } from "../enums/state-product.enum";
import type { IProduct } from "../interfaces/product.interface";

export class Product implements IProduct {
  id!: string;
  state: STATE_PRODUCT = STATE_PRODUCT.ACTIVE;
  ref!: string;
  description!: string;

  constructor(obj?: Partial<IProduct>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
