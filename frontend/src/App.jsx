import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
        
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            background: "#1e293b",
            color: "white",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "40px" }}>Pharmacy CRM</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/inventory" style={linkStyle}>Inventory</Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, background: "#f1f5f9" }}>
          
          {/* Header */}
          <div
            style={{
              background: "white",
              padding: "15px 30px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontWeight: "bold",
            }}
          >
            SwasthiQ Pharmacy Management
          </div>

          {/* Page Content */}
          <div style={{ padding: "30px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
};

export default App;