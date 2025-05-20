import { StateOrder } from "../enums/state-order.enum";
import type { OrderI } from "../interfaces/order.interface";

export class Order implements OrderI {
  id!: string;
  unitPrice = 1500;
  nbOfDays = 1;
  vat = 20;
  state = StateOrder.OPTION;
  type!: string;
  customer!: string;
  comment!: string;
  constructor(obj?: Partial<Order>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

// new Order()
// new Order(order)
// new Order({unitPrice: 500, customer: 'Atos'})
