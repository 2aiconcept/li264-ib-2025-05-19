import axios from "axios";
import { Order } from "../models/order.model";
import type { OrderI } from "../interfaces/order.interface";
import type { StateOrder } from "../enums/state-order.enum";

const BASE_URL = import.meta.env.VITE_API_URL;

// get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await axios.get<OrderI[]>(`${BASE_URL}/orders`);
    return data.map((item) => new Order(item));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.message
      : "Une erreur s'est produite";

    throw new Error(message);
  }
};

// get order by id
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const { data } = await axios.get<Order>(`${BASE_URL}/orders/${id}`);
    return new Order(data);
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.message
      : "Une erreur s'est produite";

    throw new Error(message);
  }
};

// change state order
export const updateOrderState = async (
  order: OrderI,
  newState: StateOrder
): Promise<OrderI> => {
  const item = new Order({ ...order, state: newState });
  return updateOrder(item);
};

// update order
export const updateOrder = async (order: OrderI): Promise<OrderI> => {
  try {
    const { data } = await axios.put<Order>(
      `${BASE_URL}/orders/${order.id}`,
      order
    );
    return new Order(data);
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.message
      : "Une erreur s'est produite";

    throw new Error(message);
  }
};

// add order
export const addOrder = async (order: OrderI): Promise<Order> => {
  try {
    const { data } = await axios.post<Order>(`${BASE_URL}/orders`, order);
    return new Order(data);
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.message
      : "Une erreur s'est produite";

    throw new Error(message);
  }
};
// delete order
export const deleteOrder = async (id: string): Promise<Order> => {
  try {
    const { data } = await axios.delete<Order>(`${BASE_URL}/orders/${id}`);
    return new Order(data);
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.message
      : "Une erreur s'est produite";

    throw new Error(message);
  }
};
