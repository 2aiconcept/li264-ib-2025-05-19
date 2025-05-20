import { useState } from "react";
import { Order } from "../models/order.model";
import FormOrder from "../shared/components/FormOrder";
import { addOrder } from "../services/orders.service";
import { useNavigate } from "react-router-dom";

function AddOrder() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // envoie du formulaire
  const handleSubmit = (order: Order) => {
    console.log(order);
    setLoading(true); // affiche un loader si api met du temps a répondre
    // Appel API ici
    addOrder(order)
      .then(() => navigate("/orders"))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Add Order</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <FormOrder
          initialOrder={new Order()}
          formValue={handleSubmit}
        />
      )}
    </div>
  );
}
export default AddOrder;
