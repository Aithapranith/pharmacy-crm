# Pharmacy CRM System – SwasthiQ Hiring Assignment

This project is a simplified Pharmacy Module built as part of the SwasthiQ SDE Intern hiring assignment.

It consists of:

- Dashboard Page (Sales Overview)
- Inventory Page
- Fully functional REST APIs built using FastAPI
- React frontend integrated with real backend APIs

---

## 🛠 Tech Stack

### Backend
- Python
- FastAPI
- SQLite
- SQLAlchemy ORM
- Pydantic (Validation)

### Frontend
- React (Functional Components + Hooks)
- React Router
- Vite

---

# 📂 Project Structure
pharmacy-emr/
│
├── backend/ # FastAPI backend
│ ├── main.py
│ ├── models.py
│ ├── schemas.py
│ ├── database.py
│ └── pharmacy.db
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Inventory.jsx
│ │ └── App.jsx
│
└── README.md


---

# 🚀 Features Implemented

## 📊 Dashboard Page

- Sales Summary Card
- Items Sold Card
- Low Stock Indicator
- Purchase Order Summary
- Recent Sales List
- All data fetched from backend APIs

---

## 📦 Inventory Page

- Inventory Overview Summary
- Complete Medicines Table
- Add Medicine
- Update Medicine
- Delete Medicine
- Search & Filter
- Status Indicators:
  - Active
  - Low Stock
  - Expired
  - Out of Stock

---

# 🔗 REST API Design

The backend follows RESTful conventions with clear separation of concerns.

## Inventory APIs

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/medicines` | List all medicines (with search support) |
| POST | `/medicines` | Add new medicine |
| PUT | `/medicines/{id}` | Update medicine |
| DELETE | `/medicines/{id}` | Delete medicine |
| GET | `/inventory/summary` | Inventory overview summary |

---

## Dashboard APIs

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/dashboard/summary` | Sales & inventory summary |
| GET | `/dashboard/low-stock` | Low stock items |
| GET | `/dashboard/recent-sales` | Recent sales list |
| GET | `/dashboard/purchase-orders` | Purchase order summary |

---

# 🔐 Data Consistency & Business Logic

### 1️⃣ Status Automation

Medicine status is automatically calculated during creation and update:

- Expired → if expiry date < current date
- Out of Stock → if stock == 0
- Low Stock → if stock < 10
- Active → otherwise

This ensures:
- No manual status errors
- Consistent inventory tracking
- Accurate dashboard insights

---

### 2️⃣ Inventory Summary Consistency

Inventory summary dynamically calculates:

- Total Items
- Active Items
- Low Stock Count
- Total Inventory Value

All values are computed directly from the database to maintain real-time accuracy.

---

### 3️⃣ Proper Validation

- Pydantic schemas validate request bodies
- Structured JSON responses returned
- Proper HTTP status codes used

---

# 🧠 Architecture Explanation

The application follows a clean layered architecture:

Frontend (React)
↓
REST API Calls
↓
FastAPI Routes
↓
SQLAlchemy ORM
↓
SQLite Database

This separation ensures:
- Scalability
- Maintainability
- Clear API contracts
- Independent frontend/backend development

---

# ▶️ How To Run The Project

## Backend

```bash
cd backend
uvicorn main:app --reload