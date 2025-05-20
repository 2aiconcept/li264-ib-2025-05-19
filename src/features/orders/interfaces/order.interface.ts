import { StateOrder } from "../enums/state-order.enum";

export interface OrderI {
  id: string;
  unitPrice: number;
  nbOfDays: number;
  vat: number;
  state: StateOrder;
  type: string;
  customer: string;
  comment: string;
}
