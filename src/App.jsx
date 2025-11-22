import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <nav style={{ padding: "10px 20px", background: "#111827", color: "white", display: "flex", justifyContent: "space-between" }}>
        <div>ERP Inventory</div>
        <div>
          <button className="btn btn-secondary" onClick={() => setPage("dashboard")} style={{ marginRight: 8 }}>Dashboard</button>
          <button className="btn btn-secondary" onClick={() => setPage("products")}>Products</button>
        </div>
      </nav>
      {page === "dashboard" ? <Dashboard /> : <ProductList />}
    </div>
  );
}

export default App;
