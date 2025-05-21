import {
  setLoading,
  setProducts,
  setProductsError,
  setCurrentProduct,
  addProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
} from "./productSlice";
import {
  getProducts,
  getProductById,
  addProductApi,
  updateProductApi,
  deleteProductApi,
  updateStateProductApi,
} from "../services/products.service";

/**
 * Avec redux toolkit thunk est un middleware
 * les effects sont des fonctions pour gérer les appels api et effets de bord
 * les effects ne sont pas des actions avec un type et un payload
 * @exemple dispatch(fetchProduct())
 * thunk middleware capte tous les dispatch dans le code et verifie
 * en arrière plan si ce qui est passé au dispatch est un objet action (type+payload)
 * ou une fonction qu'il doit exécuter (faire apel api et dispatch en retour une action)
 *
 */

import type { AppDispatch } from "../../../../store";
import type { IProduct } from "../interfaces/product.interface";
import type { STATE_PRODUCT } from "../enums/state-product.enum";

/**
 * thunk effect pour récupérer tous les produits
 *
 * Dispatche les actions:
 * - setLoading(true/false)
 * - setProducts(products) en cas de succès
 * - setProductsError(message) en cas d'erreur
 */
export const fetchProducts = () => {
  return async (dispatch: AppDispatch) => {
    try {
      // Début du chargement
      dispatch(setLoading(true));

      // Appel API
      const products = await getProducts();

      // Succès
      dispatch(setProducts(products));
    } catch (error) {
      // Erreur
      let message = "Une erreur est survenue lors du chargement des produits";
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch(setProductsError(message));
    } finally {
      // Fin du chargement
      dispatch(setLoading(false));
    }
  };
};

/**
 * thunk effect fetchProductById
 * @params id: string
 * lorsque dispatch(fetchProductById(un_id)) dans le code d'un composant
 * -> try
 * state.loading a true
 * appel api en utilisant la méthode appropriée du service
 * dispatch(setCurrentProduct(reponse api))
 * -> catch
 * dispatch setProductsError(error api)
 * -> finally
 * dispatch setLoading(false)
 */

export const fetchProductById = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const product = await getProductById(id);

      // Action captured by reducer to update property currentProduct in state products
      dispatch(setCurrentProduct(product));
    } catch (error) {
      let message = `Erreur lors de la récupération du produit (ID: ${id})`;
      if (error instanceof Error) {
        message = error.message;
      }
      //   action captured by reducer to modify property error in state products
      dispatch(setProductsError(message));
    } finally {
      // action captured by reducer to modify property loading in state products
      dispatch(setLoading(false));
    }
  };
};

/**
 * thunk effect addProduct
 * @params IProduct
 * lorsque dispatch(addProduct(product sans id)) dans le code d'un composant
 * l'id sera ajouté par l'api coté back
 * -> try
 * state.loading a true
 * appel api en utilisant la méthode appropriée du service
 * dispatch(addProductSuccess(reponse api))
 * -> catch
 * dispatch setProductsError(error api)
 * -> finally
 * dispatch setLoading(false)
 */
export const addProduct = (product: IProduct) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Appel API pour créer le produit
      const newProduct = await addProductApi(product);

      // Ajouter le nouveau produit au store
      dispatch(addProductSuccess(newProduct));

      // Optionnel: définir comme produit courant
      dispatch(setCurrentProduct(newProduct));
    } catch (error) {
      let message = "Erreur lors de l'ajout du produit";
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch(setProductsError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * tunk effect pour update un produit existant
 *
 * @param product Le produit modifié (doit contenir un ID valide)
 */
export const updateProduct = (product: IProduct) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Appel API pour mettre à jour le produit
      const updatedProduct = await updateProductApi(product);

      // Mettre à jour le produit dans le store
      dispatch(updateProductSuccess(updatedProduct));

      // Mettre à jour le produit courant
      dispatch(setCurrentProduct(updatedProduct));
    } catch (error) {
      let message = `Erreur lors de la mise à jour du produit (ID: ${product.id})`;
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch(setProductsError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * thunk effect pour changer le state d'un produit
 *
 * @param product Le produit à modifier
 * @param newState Le nouvel état (ACTIVE ou INACTIVE)
 */
export const updateProductState = (
  product: IProduct,
  newState: STATE_PRODUCT
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Appel API pour mettre à jour le produit
      const updatedProduct = await updateStateProductApi(product, newState);

      // Mettre à jour le produit dans le store
      dispatch(updateProductSuccess(updatedProduct));

      // Si c'est le produit courant, le mettre à jour aussi
      if (product.id === updatedProduct.id) {
        dispatch(setCurrentProduct(updatedProduct));
      }
    } catch (error) {
      let message = `Erreur lors de la mise à jour de l'état du produit (ID: ${product.id})`;
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch(setProductsError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * thunk effect pour delete un produit
 *
 * @param id L'identifiant du produit à supprimer
 */
export const deleteProduct = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Appel API pour supprimer le produit
      await deleteProductApi(id);

      // Supprimer le produit du store
      dispatch(deleteProductSuccess(id));

      // Si c'était le produit courant, le réinitialiser
      dispatch(setCurrentProduct(null));
    } catch (error) {
      let message = `Erreur lors de la suppression du produit (ID: ${id})`;
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch(setProductsError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
