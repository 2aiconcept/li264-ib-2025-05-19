import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { selectError, selectLoading } from "../redux/productSelectors";
import { Product } from "../models/product.model";
import { addProduct } from "../redux/productThunkEffect";
import FormProduct from "../shared/components/FormProduct";

function AddProduct() {
  // 1. new product pour props form afin d'init le formulaire
  // 2. fn handleSave
  //    -> dispatch(fetchAddProduct(product)) product etant les data qui viennent de l'enfant
  //    -> utilise hook perso useAppDispatch
  //    -> utilise fetchAddProduct
  // 3. fn handleCancel
  //    -> utilise useNavigate
  // 4. passer dernier props loading
  //    -> utilise le selector selectLoading pour récupérer loading dans le state
  // 5. afficher FormProduct et lui passer les props
  //    -> penser à afficher au dessus tu formulaire un msg si error dans le state
  //    -> utilise useAppSelector et selectError

  // Hooks pour la navigation et Redux
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => selectLoading(state)) as boolean;
  const error = useAppSelector((state) => selectError(state)) as string | null;

  // Créer un new Order() à passer en props au formulaire pour l'initialiser
  const newProduct = new Product();

  /**
   * Fonction appelée quand le formulaire est soumis
   * @param product
   */
  const handleSave = (product: Product) => {
    // Dispatcher l'action pour ajouter le produit
    dispatch(addProduct(product));
    navigate("/products");
  };

  /**
   * Fonction pour annuler et retourner à la liste
   */
  const handleCancel = () => {
    navigate("/products");
  };
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Ajouter un produit</h2>
            </div>
            <div className="card-body">
              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <FormProduct
                initialProduct={newProduct}
                onSave={handleSave}
                onCancel={handleCancel}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddProduct;
