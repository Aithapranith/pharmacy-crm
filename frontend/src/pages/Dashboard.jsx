import { useEffect, useState } from "react";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    fetch("https://pharmacy-crm-hgur.onrender.com/dashboard/summary")
      .then(res => res.json())
      .then(data => setSummary(data));

    fetch("https://pharmacy-crm-hgur.onrender.com/dashboard/low-stock")
      .then(res => res.json())
      .then(data => setLowStock(data));

    fetch("https://pharmacy-crm-hgur.onrender.com/dashboard/recent-sales")
      .then(res => res.json())
      .then(data => setRecentSales(data));

    fetch("https://pharmacy-crm-hgur.onrender.com/dashboard/purchase-orders")
      .then(res => res.json())
      .then(data => setOrders(data));

  }, []);

  return (
  <div style={{ padding: "30px", background: "#f5f6fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "25px" }}>Pharmacy CRM Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
       <Card title="Total Items" value={summary.total_items} color="#3498db" />
<Card title="Low Stock Items" value={summary.low_stock} color="#e67e22" />
<Card title="Total Inventory Value" value={`₹${summary.total_value || 0}`} color="#2ecc71" />
<Card title="Today's Sales" value={`₹${summary.today_sales || 0}`} color="#9b59b6" />
      </div>

      {/* Purchase Orders */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Purchase Orders Summary</h3>
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <Card title="Total Orders" value={orders.total_orders} color="#1abc9c" />
<Card title="Pending Orders" value={orders.pending_orders} color="#e74c3c" />
<Card title="Completed Orders" value={orders.completed_orders} color="#27ae60" />
        </div>
      </div>

      {/* Low Stock Section */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Low Stock Medicines</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.length === 0 ? (
              <tr>
                <td colSpan="3">No low stock items</td>
              </tr>
            ) : (
              lowStock.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>
                    <span style={{
                      background: "#e74c3c",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "5px"
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Sales */}
      <div>
        <h3>Recent Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.invoice}</td>
                <td>{sale.customer}</td>
                <td>₹{sale.amount}</td>
                <td>
                  <span style={{
                    background: sale.status === "Completed" ? "#2ecc71" : "#f39c12",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "5px"
                  }}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{
      background: "#ffffff",
      borderLeft: `6px solid ${color}`,
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      minWidth: "200px",
      flex: "1"
    }}>
      <h4 style={{ marginBottom: "10px", color: "#555" }}>{title}</h4>
      <h2 style={{ color: color }}>{value || 0}</h2>
    </div>
  );
}

export default Dashboard;