import axios from "axios";
import type { IProduct } from "../interfaces/product.interface";
import { STATE_PRODUCT } from "../enums/state-product.enum";
import { Product } from "../models/product.model";

/**
 * url api
 */
const API_URL = `${import.meta.env.VITE_API_URL}/products`;

/**
 * @description get all products
 * @returns
 */
export const getProducts = async (): Promise<IProduct[]> => {
  const response = await axios.get<IProduct[]>(API_URL);
  return response.data;
};

/**
 * @description get product by id
 * @param id
 * @returns
 */
export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await axios.get<IProduct>(`${API_URL}/${id}`);
  return response.data;
};

/**
 * @description change product state
 * @param product
 * @param newState
 * @returns
 */
export const updateStateProductApi = async (
  product: IProduct,
  newState: STATE_PRODUCT
): Promise<IProduct> => {
  const item = new Product({ ...product, state: newState });
  return updateProductApi(item);
};

/**
 * @description update product
 * @param product
 * @returns
 */
export const updateProductApi = async (
  product: IProduct
): Promise<IProduct> => {
  const response = await axios.put<IProduct>(
    `${API_URL}/${product.id}`,
    product
  );
  return response.data;
};

/**
 * @description add product
 * @param product
 * @returns
 */
export const addProductApi = async (product: IProduct): Promise<IProduct> => {
  const response = await axios.post<IProduct>(API_URL, product);
  return response.data;
};

/**
 * @description delete product
 * @param id
 * @returns
 */
export const deleteProductApi = async (id: string): Promise<IProduct> => {
  const response = await axios.delete<IProduct>(`${API_URL}/${id}`);
  return response.data;
};
