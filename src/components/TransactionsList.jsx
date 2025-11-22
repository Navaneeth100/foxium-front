import React from "react";

export default function TransactionsList({ movements }) {
  if (!movements || movements.length === 0) {
    return <p style={{ fontSize: 14 }}>No recent movements</p>;
  }

  return (
    <ul style={{ paddingLeft: 16, margin: 0 }}>
      {movements.map((m) => (
        <li key={m._id} style={{ fontSize: 14, marginBottom: 4 }}>
          <strong>{m.type}</strong> - {m.productId?.name} - {m.quantity}
        </li>
      ))}
    </ul>
  );
}
