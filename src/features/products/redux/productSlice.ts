import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProduct } from "../interfaces/product.interface";

// 1. Définition de l'état
interface ProductState {
  products: IProduct[];
  currentProduct: IProduct | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// 2. Création du slice (combine reducer et actions)
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // creation des actions et generation des reducers
    /**
     * Action pour réfinir l'état du chargement
     * @exemple dans le code dispatch(setLoading(true or false));
     * @params boolean
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    /**
     * Action pour la gestion des erreurs. met à jour error dans la slice products du store (state products)
     * @params string
     * @exemple dispatch(setProductsError(message));
     */
    setProductsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /**
     * Action pour mettre à jour la liste des procucts dans la slice
     * products du state global
     * @params IProduct[]
     * @exemple dispatch(setProducts(products));
     */
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
      state.error = null;
    },

    /**
     * Action pour maj la propriété currentProduct du state products
     * @params IProduct | null
     * @exemple dispatch(setCurrentProduct(product));
     */
    setCurrentProduct: (state, action: PayloadAction<IProduct | null>) => {
      state.currentProduct = action.payload;
      state.error = null;
    },
    /**
     * Action pour ajouter un produit dans le state products
     * @params IProduct
     * @exemple dispatch(addProductSuccess(product))
     */
    addProductSuccess: (state, action: PayloadAction<IProduct>) => {
      state.products.push(action.payload);
      state.error = null;
    },
    /**
     * Action pour update un produit dans le state products
     * @params IProduct
     * @exemple distpatch(updateProductSuccess(product))
     */
    updateProductSuccess: (state, action: PayloadAction<IProduct>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.error = null;
    },
    /**
     * Action pour delete un produit dans le state products
     * @params string
     * @exemple distpatch(deleteProductSuccess(id))
     */
    deleteProductSuccess: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProducts,
  setProductsError,
  setCurrentProduct,
  addProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;
