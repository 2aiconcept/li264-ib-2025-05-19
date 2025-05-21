// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../src/features/products/redux/productSlice";

// Store simple sans types complexes
export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

// Types de base pour les hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
