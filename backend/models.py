from sqlalchemy import Column, Integer, String, Float
from database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    stock = Column(Integer)
    price = Column(Float)
    expiry_date = Column(String)
    status = Column(String, default="Active")