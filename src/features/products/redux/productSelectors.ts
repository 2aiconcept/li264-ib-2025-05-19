// src/features/products/redux/productSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/index";
import type { IProduct } from "../interfaces/product.interface";

// Sélecteur de base
export const selectProductState = (state: RootState) => state.products;

/**
 * Un sélecteur est une fonction pure qui extrait des données spécifiques
 * du state  de votre application
 * Redux Toolkit : Fournit l'utilitaire createSelector (qui vient en fait de la
 * bibliothèque Reselect)
 *
 * 2 types de selecteurs : selecteurs de base et
 * selecteurs dérivés (avec createSelector)
 *
 * un selecteur de base est ne simple fonction qui prend le state global et retourne
 * une partie spécifique (exemple le state products)
 *
 * un selecteur dérivé utilise d'autres selecteurs en entrée (ici selectProcutState)
 * il permet de récupérer des données directement du state sélectionné
 *
 * @exemple const products = useSelector(selectAllProducts);
 * avec notre hook personnalisé :
 * @empemple const products = useAppSelector(selectAllProducts);
 * avec typescript si probleme de typage
 * @exemple const products = useAppSelector((state) =>
     selectAllProducts(state)
   ) as IProduct[];
 */
// Sélecteurs dérivés
export const selectAllProducts = createSelector(
  [selectProductState],
  (state): IProduct[] => state.products
);

export const selectCurrentProduct = createSelector(
  [selectProductState],
  (state): IProduct | null => state.currentProduct
);

export const selectLoading = createSelector(
  [selectProductState],
  (state): boolean => state.loading
);

export const selectError = createSelector(
  [selectProductState],
  (state): string | null => state.error
);

// Sélecteur avec paramètre alternative si on utilise pas la propriété du state currentProduct
export const selectProductById = (id: string) =>
  createSelector(
    [selectAllProducts],
    (products): IProduct | null =>
      products.find((product) => product.id === id) || null
  );
