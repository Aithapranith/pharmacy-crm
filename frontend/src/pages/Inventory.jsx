import { useEffect, useState } from "react";

function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    expiry_date: ""
  });

  // Fetch Medicines
  const fetchMedicines = () => {
    fetch(`https://pharmacy-crm-hgur.onrender.com/medicines?search=${search}`)
      .then(res => res.json())
      .then(data => setMedicines(data));
  };

  // Fetch Summary
  const fetchSummary = () => {
    fetch("https://pharmacy-crm-hgur.onrender.com/inventory/summary")
      .then(res => res.json())
      .then(data => setSummary(data));
  };

  useEffect(() => {
    fetchMedicines();
    fetchSummary();
  }, [search]);

  // Add OR Update Medicine
  const handleSubmit = () => {
    if (editingId) {
      fetch(`https://pharmacy-crm-hgur.onrender.com/medicines/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).then(() => {
        setEditingId(null);
        resetForm();
        fetchMedicines();
        fetchSummary();
      });
    } else {
      fetch("https://pharmacy-crm-hgur.onrender.com/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).then(() => {
        resetForm();
        fetchMedicines();
        fetchSummary();
      });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      stock: "",
      price: "",
      expiry_date: ""
    });
  };

  const deleteMedicine = (id) => {
    fetch(`https://pharmacy-crm-hgur.onrender.com/medicines/${id}`, {
      method: "DELETE"
    }).then(() => {
      fetchMedicines();
      fetchSummary();
    });
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setForm({
      name: med.name,
      category: med.category,
      stock: med.stock,
      price: med.price,
      expiry_date: med.expiry_date
    });
  };

  const badgeStyle = (status) => {
  if (status === "Active") return { background: "#2ecc71" };
  if (status === "Available") return { background: "#3498db" };  // 🔵 Blue
  if (status === "Low Stock") return { background: "#f39c12" };
  if (status === "Expired") return { background: "#e74c3c" };
  if (status === "Out of Stock") return { background: "#7f8c8d" };
  return { background: "#95a5a6" };
};

  return (
    <div style={{ padding: "30px", background: "#f5f6fa", minHeight: "100vh" }}>
      <h2>Inventory Management</h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
        <Card title="Total Items" value={summary.total_items} />
        <Card title="Active Items" value={summary.active_items} />
        <Card title="Low Stock" value={summary.low_stock} />
        <Card title="Total Value" value={`₹${summary.total_value || 0}`} />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />

      {/* Add / Edit Form */}
      <div style={{ marginBottom: "30px" }}>
        <h3>{editingId ? "Edit Medicine" : "Add Medicine"}</h3>

        <input placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input type="number" placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })}
        />

        <input type="number" placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
        />

        <input type="date"
          value={form.expiry_date}
          onChange={e => setForm({ ...form, expiry_date: e.target.value })}
        />

        <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button onClick={() => { setEditingId(null); resetForm(); }} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </div>

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(med => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td>{med.category}</td>
              <td>{med.stock}</td>
              <td>₹{med.price}</td>
              <td>{med.expiry_date}</td>
              <td>
                <span style={{
                  ...badgeStyle(med.status),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "5px"
                }}>
                  {med.status}
                </span>
              </td>
              <td>
                <button onClick={() => startEdit(med)}>Edit</button>
                <button onClick={() => deleteMedicine(med.id)} style={{ marginLeft: "5px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      minWidth: "200px"
    }}>
      <h4>{title}</h4>
      <h2>{value || 0}</h2>
    </div>
  );
}

export default Inventory;