import { useState } from "react";
import type { IProduct } from "../../interfaces/product.interface";
import type { Product } from "../../models/product.model";
import { STATE_PRODUCT_LABELS } from "../../enums/state-product.enum";

interface FormProductProps {
  initialProduct: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
  loading?: boolean;
}

function FormProduct({
  initialProduct,
  onSave,
  onCancel,
  loading = false,
}: FormProductProps) {
  const [formData, setFormData] = useState<IProduct>(initialProduct);

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "state" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* Champ Référence */}
      <div className="mb-3">
        <label
          htmlFor="ref"
          className="form-label"
        >
          Référence *
        </label>
        <input
          type="text"
          className="form-control"
          id="ref"
          name="ref"
          value={formData.ref}
          onChange={handleChange}
          required
          placeholder="ex: PRD-001"
        />
        <div className="form-text">
          Entrez une référence unique pour le produit.
        </div>
      </div>

      {/* Champ Description */}
      <div className="mb-3">
        <label
          htmlFor="description"
          className="form-label"
        >
          Description *
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Description du produit..."
        ></textarea>
      </div>

      {/* Champ État */}
      <div className="mb-3">
        <label
          htmlFor="state"
          className="form-label"
        >
          État
        </label>
        <select
          className="form-select"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
        >
          {Object.entries(STATE_PRODUCT_LABELS).map(([key, label]) => (
            <option
              key={key}
              value={key}
            >
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Boutons */}
      <div className="d-flex justify-content-between mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Sauvegarde en cours...
            </>
          ) : (
            "Enregistrer"
          )}
        </button>
      </div>
    </form>
  );
}
export default FormProduct;
