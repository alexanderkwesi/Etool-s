import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./backend_etool.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    subscription_plan = Column(String, default="Begin Plan") # Begin Plan, Standard Plan, Pro Plan
    otp_secret = Column(String, nullable=True)
    otp_enabled = Column(Boolean, default=False)
    company_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    user_type = Column(String, nullable=True) # Electrical Engineer, Computing, etc.
    team_size = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    crm_contacts = relationship("CRMContact", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # Invoice, Receipt, Contract, Spec, TXN
    vendor = Column(String, nullable=True)
    date_issued = Column(String, nullable=True)
    reference_number = Column(String, nullable=True)
    amount = Column(Float, default=0.0)
    currency = Column(String, default="GBP")
    raw_text = Column(Text, nullable=True)
    synced_to_crm = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")

class CRMContact(Base):
    __tablename__ = "crm_contacts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    title = Column(String, nullable=True)
    status = Column(String, default="active") # active, inactive
    notes = Column(Text, nullable=True)
    last_contacted = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="crm_contacts")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False) # Login, OCR Process, CRM Sync, etc.
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
