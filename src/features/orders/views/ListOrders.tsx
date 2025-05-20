import { useEffect, useState } from "react";
import type { OrderI } from "../interfaces/order.interface";
import "./ListOrders.css";
import {
  deleteOrder,
  getAllOrders,
  updateOrderState,
} from "../services/orders.service";
import { useNavigate } from "react-router-dom";
import { preloadAddOrder, preloadEditOrder } from "../orders.routes";
import { STATE_ORDER_LABELS, StateOrder } from "../enums/state-order.enum";
import { total } from "../../../utils/total";
import { formatCurrency } from "../../../utils/currency";

function ListOrders() {
  const [orders, setOrders] = useState<OrderI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then((orders) => setOrders(orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();

  //   change state
  const handleStateChange = (order: OrderI, newState: StateOrder) => {
    // console.log("Mise à jour de", order, "avec le nouvel état", newState);
    // Appel API
    updateOrderState(order, newState)
      .then((response) => {
        // console.log(response);
        order.state = response.state;
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === response.id ? response : o))
        );
      })
      .catch((err) => {
        console.error("Erreur de mise à jour :", err.message);
      });
  };

  //   delete item
  const deleteItem = (id: string) => {
    if (window.confirm("Do you really want to delete this order ?")) {
      setLoading(true);
      deleteOrder(id)
        .then(() => {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== id)
          );
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };
  return (
    <div>
      <h1>List orders</h1>
      <button
        className="btn btn-primary"
        onMouseEnter={preloadAddOrder}
        onClick={() => navigate("/orders/add")}
      >
        Add Order
      </button>

      {loading && <p>Chargement en cours...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Type</th>
              <th>Unit Price</th>
              <th>Duration</th>
              <th>Total Ex. taxes</th>
              <th>Total Inc. taxes</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`state-${STATE_ORDER_LABELS[
                  order.state
                ].toLowerCase()}`}
              >
                <td>{order.customer}</td>
                <td>{order.type}</td>
                <td>{order.unitPrice}</td>
                <td>{order.nbOfDays}</td>
                <td>
                  {formatCurrency(total(order.unitPrice, order.nbOfDays))}
                </td>
                <td>
                  {formatCurrency(
                    total(order.unitPrice, order.nbOfDays, order.vat),
                    "USD",
                    "en-US"
                  )}
                </td>
                {/* <td>{STATE_ORDER_LABELS[order.state]}</td> */}
                {/* ou afficher les libéllés dans un select */}
                <td>
                  <select
                    name="state"
                    className="form-select"
                    value={order.state}
                    onChange={(e) =>
                      handleStateChange(order, Number(e.target.value))
                    }
                  >
                    {Object.entries(STATE_ORDER_LABELS).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onMouseEnter={preloadEditOrder}
                    onClick={() => navigate(`/orders/edit/${order.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default ListOrders;
