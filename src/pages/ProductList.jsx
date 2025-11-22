import React, { useEffect, useState } from "react";
import { API } from "../api";
import StockModal from "../components/StockModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all products

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/products", { params: { search } });
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="container" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Products</h3>

        <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
          + Create Product
        </button>
      </div>

      <input
        className="form-control"
        placeholder="Search by name or SKU"
        style={{ marginTop: 16, marginBottom: 12, padding: 8 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="table table-bordered text-center" style={{ textAlign: "center" }}>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Unit Price</th>
            <th>Status</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {products.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="text-center">{p.name}</td>
              <td className="text-center">{p.SKU}</td>
              <td>{p.quantity}</td>
              <td>₹{p.unitPrice}</td>
              <td>
                {p.quantity <= p.reorderLevel ? (
                  <span className="badge bg-danger">Low</span>
                ) : (
                  <span className="badge bg-success">Normal</span>
                )}
              </td>

              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedProduct(p)}
                >
                  Update Stock
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && !loading && (
            <tr>
              <td colSpan="6" className="text-center text-muted">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedProduct && (
        <StockModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          refresh={fetchProducts}
        />
      )}

      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
}

function CreateProductModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    SKU: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    unitPrice: "",
    supplier: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      if (!form.name || !form.SKU) {
        setError("Name and SKU are required.");
        return;
      }

      await API.post("/products", form);
      refresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}>
      <div className="modal-dialog bg-white" style={{ padding: 20, borderRadius: 8, width: 400, background: "whitesmoke" }}>
        <h4>Create Product</h4>

        {["name", "SKU", "category", "supplier"].map((field) => (
          <FormInput
            key={field}
            label={field.toUpperCase()}
            value={form[field]}
            placeholder={`Enter ${field}`}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}

        {["quantity", "reorderLevel", "unitPrice"].map((field) => (
          <FormInput
            key={field}
            type="number"
            label={field.toUpperCase()}
            value={form[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button className="btn btn-success" onClick={handleCreate} disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}


function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 10, marginLeft: 10 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        style={{ padding: 8, marginTop: 4, marginLeft: 10  }}
      />
    </div>
  );
}
