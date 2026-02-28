from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATABASE DEPENDENCY ---------------- #

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# ================= INVENTORY APIs ====================
# =====================================================

# Add Medicine (Auto Status Logic)
@app.post("/medicines", response_model=schemas.MedicineResponse)
def add_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    today = date.today()
    expiry = date.fromisoformat(medicine.expiry_date)

    # Auto status calculation
    if expiry < today:
        medicine.status = "Expired"
    elif medicine.stock == 0:
        medicine.status = "Out of Stock"
    elif medicine.stock < 10:
        medicine.status = "Low Stock"
    else:
        medicine.status = "Active"

    new_med = models.Medicine(**medicine.dict())
    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return new_med


# Get Medicines (Search + Filter)
@app.get("/medicines", response_model=list[schemas.MedicineResponse])
def get_medicines(search: str = "", db: Session = Depends(get_db)):
    query = db.query(models.Medicine)

    if search:
        query = query.filter(models.Medicine.name.contains(search))

    return query.all()


# Update Medicine
@app.put("/medicines/{med_id}", response_model=schemas.MedicineResponse)
def update_medicine(med_id: int, medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    med = db.query(models.Medicine).filter(models.Medicine.id == med_id).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    for key, value in medicine.dict().items():
        setattr(med, key, value)

    # Recalculate status
    today = date.today()
    expiry = date.fromisoformat(med.expiry_date)

    if expiry < today:
        med.status = "Expired"
    elif med.stock == 0:
        med.status = "Out of Stock"
    elif med.stock < 10:
        med.status = "Low Stock"
    else:
        med.status = "Active"

    db.commit()
    db.refresh(med)
    return med


# Delete Medicine
@app.delete("/medicines/{med_id}")
def delete_medicine(med_id: int, db: Session = Depends(get_db)):
    med = db.query(models.Medicine).filter(models.Medicine.id == med_id).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(med)
    db.commit()
    return {"message": "Medicine deleted successfully"}


# Inventory Summary
@app.get("/inventory/summary")
def inventory_summary(db: Session = Depends(get_db)):
    total = db.query(models.Medicine).count()
    low = db.query(models.Medicine).filter(models.Medicine.stock < 10).count()
    active = db.query(models.Medicine).filter(models.Medicine.status == "Active").count()

    total_value = sum([m.price * m.stock for m in db.query(models.Medicine).all()])

    return {
        "total_items": total,
        "active_items": active,
        "low_stock": low,
        "total_value": total_value
    }


# =====================================================
# ================= DASHBOARD APIs ====================
# =====================================================

# Main Dashboard Summary
@app.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_items = db.query(models.Medicine).count()
    low_stock = db.query(models.Medicine).filter(models.Medicine.stock < 10).count()

    total_value = sum([med.price * med.stock for med in db.query(models.Medicine).all()])

    return {
        "total_items": total_items,
        "low_stock": low_stock,
        "total_value": total_value,
        "today_sales": 12450
    }


# Low Stock List
@app.get("/dashboard/low-stock", response_model=list[schemas.MedicineResponse])
def low_stock_items(db: Session = Depends(get_db)):
    return db.query(models.Medicine).filter(models.Medicine.stock < 10).all()


# Recent Sales (Structured Dummy Data)
@app.get("/dashboard/recent-sales")
def recent_sales():
    return [
        {"invoice": "INV-001", "customer": "Ravi Kumar", "amount": 450, "status": "Completed"},
        {"invoice": "INV-002", "customer": "Anita Sharma", "amount": 1200, "status": "Completed"},
        {"invoice": "INV-003", "customer": "John Mathew", "amount": 780, "status": "Pending"}
    ]


# Purchase Orders Summary
@app.get("/dashboard/purchase-orders")
def purchase_orders():
    return {
        "total_orders": 5,
        "pending_orders": 2,
        "completed_orders": 3
    }