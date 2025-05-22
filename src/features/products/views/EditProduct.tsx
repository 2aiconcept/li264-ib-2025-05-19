// src/features/products/views/EditProduct.tsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { fetchProductById, updateProduct } from "../redux/productThunkEffect";
import {
  selectCurrentProduct,
  selectLoading,
  selectError,
} from "../redux/productSelectors";
import FormProduct from "../shared/components/FormProduct";
import { Product } from "../models/product.model";

/**
 * Composant pour modifier un produit existant
 */
function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Sélecteurs Redux
  const currentProduct = useAppSelector((state) =>
    selectCurrentProduct(state)
  ) as Product;
  const loading = useAppSelector((state) => selectLoading(state)) as boolean;
  const error = useAppSelector((state) => selectError(state)) as string | null;

  // Charger le produit au montage
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleSave = (product: Product) => {
    dispatch(updateProduct(product));
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  // Afficher un spinner pendant le chargement
  if (loading && !currentProduct) {
    return (
      <div className="container mt-4 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement du produit...</p>
      </div>
    );
  }

  // Afficher un message si le produit n'est pas trouvé
  if (!loading && !currentProduct) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Produit non trouvé</h4>
          <p>Le produit que vous cherchez n'existe pas ou a été supprimé.</p>
          <hr />
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/products")}
          >
            Retour à la liste des produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Modifier le produit</h2>
              {currentProduct && (
                <small className="text-white-50">
                  Référence: {currentProduct.ref}
                </small>
              )}
            </div>
            <div className="card-body">
              {/* Correction de l'erreur de type */}
              {error && typeof error === "string" && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {currentProduct && (
                <FormProduct
                  initialProduct={currentProduct}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
