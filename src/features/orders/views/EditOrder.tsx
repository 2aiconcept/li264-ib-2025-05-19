import { useNavigate, useParams } from "react-router-dom";
import "./Editorder.css";
import { useEffect, useState } from "react";
import { Order } from "../models/order.model";
import { getOrderById, updateOrder } from "../services/orders.service";
import FormOrder from "../shared/components/FormOrder";

function Editorder() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order>(new Order());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    console.log(id);
    getOrderById(id)
      // .then(setOrder) // React rerendera
      .then((order) => setOrder(order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (order: Order) => {
    console.log(order);
    // Appel API ici
    setLoading(true); // pour afficher éventuellement un loader si l'api met du temps à répondre quand tu fais un updateOrder
    updateOrder(order)
      //.then(() => useNavigate("/orders")) // ici tu appelles le hook useNavigate() dans un callback -> INTERDIT. les hooks ne peuvent être appelés que dans le corp d'un component reactjs
      .then(() => navigate("/orders"))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div>
        <h1>Edit Order</h1>
        {loading && <p>⏳ Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && order && (
          <FormOrder
            initialOrder={order}
            formValue={handleSubmit}
          />
        )}

        {!loading && !error && !order && (
          <p className="text-warning">Commande introuvable.</p>
        )}
      </div>
    </>
  );
}

export default Editorder;
