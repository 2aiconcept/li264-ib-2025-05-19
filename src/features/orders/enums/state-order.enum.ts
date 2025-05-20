export enum StateOrder {
  CANCELED = 0,
  OPTION = 1,
  CONFIRMED = 2,
}

export const STATE_ORDER_LABELS: Record<StateOrder, string> = {
  [StateOrder.CANCELED]: "Canceled",
  [StateOrder.OPTION]: "Option",
  [StateOrder.CONFIRMED]: "Confirmed",
};

// donne ceci :
// {
//   0: "Canceled",
//   1: "Option",
//   2: "Confirmed"
// }
