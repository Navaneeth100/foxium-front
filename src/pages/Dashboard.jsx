import React, { useEffect, useState } from "react";
import { API } from "../api";
import TransactionsList from "../components/TransactionsList";

export default function Dashboard() {
  const [value, setValue] = useState(0);
  const [low, setLow] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [vRes, lowRes, movRes] = await Promise.all([
        API.get("/reports/inventory-value"),
        API.get("/products/low-stock"),
        API.get("/reports/stock-movement", {
          params: {
            start: "2024-01-01",
            end: "2099-01-01"
          }
        })
      ]);

      setValue(vRes.data.total);
      setLow(lowRes.data);
      setRecent(movRes.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container" style={{ padding: "16px" }}>
      <h3>Inventory Dashboard</h3>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 250px", background: "white", padding: 16, borderRadius: 8 }}>
          <h5>Total Inventory Value</h5>
          <h2>₹{value}</h2>
        </div>

        <div style={{ flex: "1 1 250px", background: "white", padding: 16, borderRadius: 8 }}>
          <h5>Low Stock Items</h5>
          <h2>{low.length}</h2>
        </div>

        <div style={{ flex: "1 1 250px", background: "white", padding: 16, borderRadius: 8 }}>
          <h5>Recent Stock Movements</h5>
          <TransactionsList movements={recent} />
        </div>
      </div>
    </div>
  );
}
