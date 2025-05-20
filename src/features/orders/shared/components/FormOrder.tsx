import { useState } from "react";
import type { Order } from "../../models/order.model";
import { STATE_ORDER_LABELS } from "../../enums/state-order.enum";

interface FormOrderProps {
  initialOrder: Order;
  formValue: (order: Order) => void;
}

function FormOrder({ initialOrder, formValue }: FormOrderProps) {
  const [formData, setFormData] = useState<Order>(initialOrder);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "state" ||
        name === "vat" ||
        name === "nbOfDays" ||
        name === "unitPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formValue(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="customer"
        className="form-control mb-2"
        value={formData.customer}
        onChange={handleChange}
        placeholder="Client"
      />

      <input
        name="type"
        className="form-control mb-2"
        value={formData.type}
        onChange={handleChange}
        placeholder="Type"
      />

      <input
        name="unitPrice"
        type="number"
        className="form-control mb-2"
        value={formData.unitPrice}
        onChange={handleChange}
        placeholder="Prix unitaire"
      />

      <input
        name="nbOfDays"
        type="number"
        className="form-control mb-2"
        value={formData.nbOfDays}
        onChange={handleChange}
        placeholder="Nb de jours"
      />

      <input
        name="vat"
        type="number"
        className="form-control mb-2"
        value={formData.vat}
        onChange={handleChange}
        placeholder="TVA"
      />

      <select
        name="state"
        className="form-select mb-2"
        value={formData.state}
        onChange={handleChange}
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

      <textarea
        name="comment"
        className="form-control mb-3"
        value={formData.comment}
        onChange={handleChange}
        placeholder="Commentaire"
      />

      <button className="btn btn-primary">Enregistrer</button>
    </form>
  );
}
export default FormOrder;
