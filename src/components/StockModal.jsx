import React, { useState } from "react";
import { API } from "../api";

export default function StockModal({ product, onClose, refresh }) {
  const [type, setType] = useState("IN");
  const [qty, setQty] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStock = async () => {
    try {
      setLoading(true);
      setError("");

      if (!qty || Number(qty) <= 0) {
        setError("Enter a valid quantity");
        setLoading(false);
        return;
      }

      await API.put(`/products/${product._id}/stock`, {
        type,
        quantity: Number(qty),
        reference
      });
      refresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog bg-white" style={{ padding: 16, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0 }}>{product.name}</h4>
        <p>Current Stock: {product.quantity}</p>

        <label>Transaction Type</label>
        <select
          className="form-control"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="IN">Stock IN</option>
          <option value="OUT">Stock OUT</option>
        </select>

        <label>Quantity</label>
        <input
          type="number"
          className="form-control"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <label>Reference / Notes</label>
        <input
          className="form-control"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Close
          </button>
          <button className="btn btn-success" onClick={updateStock} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
