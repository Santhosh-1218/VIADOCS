import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// /c:/Users/boppu/OneDrive/Desktop/VIADOCS/frontend/src/pages/admin/Premiums.jsx

export default function Premiums() {
    const [premiums, setPremiums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: replace with real fetch from your API
        const mock = [
            // example:
            // { id: 1, name: "Standard", amount: 9.99, status: "active" },
        ];
        setTimeout(() => {
            setPremiums(mock);
            setLoading(false);
        }, 250);
    }, []);

    return (
        <div className="admin-premiums" style={{ padding: 20 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0 }}>Premiums</h1>
                    <p style={{ margin: "6px 0 0", color: "#666" }}>Manage subscription premium plans</p>
                </div>
                <div>
                    <Link to="/admin/premiums/new" style={{ padding: "8px 12px", background: "#0b5fff", color: "#fff", borderRadius: 4, textDecoration: "none" }}>
                        Add Premium
                    </Link>
                </div>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : premiums.length === 0 ? (
                <div style={{ padding: 20, border: "1px dashed #ddd", borderRadius: 6 }}>
                    <p style={{ margin: 0 }}>No premiums yet. Click "Add Premium" to create one.</p>
                </div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 0" }}>ID</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 0" }}>Name</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 0" }}>Amount</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 0" }}>Status</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 0" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {premiums.map((p) => (
                            <tr key={p.id}>
                                <td style={{ padding: "8px 0" }}>{p.id}</td>
                                <td style={{ padding: "8px 0" }}>{p.name}</td>
                                <td style={{ padding: "8px 0" }}>{p.amount}</td>
                                <td style={{ padding: "8px 0" }}>{p.status}</td>
                                <td style={{ padding: "8px 0" }}>
                                    <Link to={`/admin/premiums/${p.id}/edit`} style={{ marginRight: 8 }}>
                                        Edit
                                    </Link>
                                    <button type="button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}