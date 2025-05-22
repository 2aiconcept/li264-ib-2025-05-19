import type { IProduct } from "../interfaces/product.interface";
import {
  selectAllProducts,
  selectError,
  selectLoading,
} from "../redux/productSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { useEffect } from "react";
import { deleteProduct, fetchProducts } from "../redux/productThunkEffect";
import { Link } from "react-router-dom";
import { STATE_PRODUCT_LABELS } from "../enums/state-product.enum";

function ListProducts() {
  // récupérer le hook perso pour dispatch
  const dispatch = useAppDispatch();
  // selector pour get loading property from state produtcs
  // use selector to get error property from state products
  // use selector to get products property from state products (retur at the first render [])
  const products = useAppSelector((state) =>
    selectAllProducts(state)
  ) as IProduct[];
  const loading = useAppSelector((state) => selectLoading(state)) as boolean;
  const error = useAppSelector((state) => selectError(state)) as string | null;

  // Gestionnaire pour la suppression d'un produit
  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-4">
        <div
          className="alert alert-danger"
          role="alert"
        >
          <h4 className="alert-heading">Une erreur est survenue</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des produits</h1>
        <Link
          to="/products/add"
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Ajouter un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          Aucun produit trouvé. Vous pouvez en ajouter un nouveau.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>Référence</th>
                <th>Description</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: IProduct) => (
                <tr key={product.id}>
                  <td>{product.ref}</td>
                  <td>{product.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.state === 1 ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {STATE_PRODUCT_LABELS[product.state]}
                    </span>
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                    >
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Éditer
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default ListProducts;
