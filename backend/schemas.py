from pydantic import BaseModel

class MedicineCreate(BaseModel):
    name: str
    category: str
    stock: int
    price: float
    expiry_date: str
    status: str

from pydantic import BaseModel, ConfigDict

class MedicineResponse(MedicineCreate):
    id: int
    
    class Config:
        orm_mode = True