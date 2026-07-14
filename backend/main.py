import os
import io
import re
import uuid
import base64
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import jwt
import pyotp
import qrcode

from .database import init_db, get_db, User, Document, CRMContact, AuditLog

# Initialize database
init_db()

app = FastAPI(title="ETOOL Redesigned API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "etool-super-secret-key-change-me"
ALGORITHM = "HS256"

# Helper: Get current user from JWT cookie
def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("session")
    if not token:
        # Check Authorization header as fallback
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# Helper: Log user actions
def log_action(db: Session, user_id: int, action: str, details: str = None):
    log = AuditLog(user_id=user_id, action=action, details=details)
    db.add(log)
    db.commit()

# --- Auth Endpoints ---

@app.post("/api/auth/signup")
def signup(data: dict, response: Response, db: Session = Depends(get_db)):
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Simple email pattern check
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Invalid email address")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # In production use passlib.hash.bcrypt, here we use simple hash for quick setup
    import hashlib
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_action(db, user.id, "Signup", "User registered successfully")

    # Issue JWT Token
    token = jwt.encode({"sub": user.email, "exp": datetime.utcnow() + timedelta(days=7)}, SECRET_KEY, algorithm=ALGORITHM)
    response.set_cookie(key="session", value=token, httponly=True, max_age=604800, samesite="lax")

    return {"status": 200, "message": "Signup successful", "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "subscription_plan": user.subscription_plan}}

@app.post("/api/auth/login")
def login(data: dict, response: Response, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    import hashlib
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if user.password_hash != password_hash:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    log_action(db, user.id, "Login", "User logged in successfully")

    # If user has 2FA enabled, do not complete login yet, return 2fa_required flag
    if user.otp_enabled:
        return {"status": 200, "message": "2FA Code Required", "2fa_required": True, "email": user.email}

    token = jwt.encode({"sub": user.email, "exp": datetime.utcnow() + timedelta(days=7)}, SECRET_KEY, algorithm=ALGORITHM)
    response.set_cookie(key="session", value=token, httponly=True, max_age=604800, samesite="lax")

    return {"status": 200, "message": "Login successful", "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "subscription_plan": user.subscription_plan}}

@app.post("/api/auth/verify-2fa")
def verify_2fa(data: dict, response: Response, db: Session = Depends(get_db)):
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and 2FA Code required")

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.otp_enabled or not user.otp_secret:
        raise HTTPException(status_code=400, detail="2FA is not enabled for this user")

    totp = pyotp.TOTP(user.otp_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")

    log_action(db, user.id, "Login 2FA Verified", "User logged in with 2FA")

    token = jwt.encode({"sub": user.email, "exp": datetime.utcnow() + timedelta(days=7)}, SECRET_KEY, algorithm=ALGORITHM)
    response.set_cookie(key="session", value=token, httponly=True, max_age=604800, samesite="lax")

    return {"status": 200, "message": "Login successful", "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "subscription_plan": user.subscription_plan}}

@app.post("/api/auth/logout")
def logout(response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_action(db, user.id, "Logout", "User logged out")
    response.delete_cookie("session")
    return {"status": 200, "message": "Logged out successfully"}

@app.get("/api/auth/check")
def check_auth(user: User = Depends(get_current_user)):
    return {
        "status": 200, 
        "user": {
            "id": user.id, 
            "email": user.email, 
            "first_name": user.first_name, 
            "last_name": user.last_name, 
            "subscription_plan": user.subscription_plan,
            "company_name": user.company_name,
            "job_title": user.job_title,
            "user_type": user.user_type,
            "team_size": user.team_size,
            "otp_enabled": user.otp_enabled
        }
    }

# --- User & Profile Endpoints ---

@app.get("/api/user/profile")
def get_profile(user: User = Depends(get_current_user)):
    return {
        "status": 200,
        "profile": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "subscription_plan": user.subscription_plan,
            "company_name": user.company_name,
            "job_title": user.job_title,
            "user_type": user.user_type,
            "team_size": user.team_size,
            "otp_enabled": user.otp_enabled
        }
    }

@app.post("/api/user/category-setup")
def category_setup(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.company_name = data.get("companyName", user.company_name)
    user.job_title = data.get("jobTitle", user.job_title)
    user.user_type = data.get("userType", user.user_type)
    user.team_size = int(data.get("teamSize", user.team_size or 1))
    db.commit()
    log_action(db, user.id, "Category Setup", "Updated professional category configuration")
    return {"status": 200, "message": "Category setup saved successfully"}

@app.get("/api/verify-category-setup")
def verify_category_setup(user: User = Depends(get_current_user)):
    completed = bool(user.company_name and user.job_title and user.user_type)
    return {"status": 200, "completed": completed}

# --- 2FA Management ---

@app.post("/api/user/2fa/enable")
def enable_2fa(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.otp_enabled:
        return {"status": 200, "message": "2FA already enabled"}
    
    secret = pyotp.random_base32()
    user.otp_secret = secret
    db.commit()

    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="ETOOL-Redesign")
    
    # Generate QR Code image
    img = qrcode.make(provisioning_uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    
    return {
        "status": 200,
        "secret": secret,
        "qr_code": f"data:image/png;base64,{qr_base64}"
    }

@app.post("/api/user/2fa/confirm")
def confirm_2fa(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Verification code required")

    if not user.otp_secret:
        raise HTTPException(status_code=400, detail="2FA secret not initialized")

    totp = pyotp.TOTP(user.otp_secret)
    if totp.verify(code):
        user.otp_enabled = True
        db.commit()
        log_action(db, user.id, "Enable 2FA", "Two-factor authentication successfully enabled")
        return {"status": 200, "message": "2FA enabled successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code")

@app.post("/api/user/2fa/disable")
def disable_2fa(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.otp_enabled = False
    user.otp_secret = None
    db.commit()
    log_action(db, user.id, "Disable 2FA", "Two-factor authentication disabled")
    return {"status": 200, "message": "2FA disabled successfully"}

# --- IDP & OCR Sandbox Endpoints ---

# Simulated text generators for OCR demo
def generate_simulated_file(filename: str) -> str:
    lower_filename = filename.lower()
    
    if "invoice" in lower_filename or "bill" in lower_filename:
        import random
        vendor = random.choice(["Acme Industrial Supplies Ltd", "Global CAD Solutions Inc.", "Precision Parts Co.", "Stark Industries"])
        ref_num = f"INV-2026-{uuid.uuid4().hex[:4].upper()}"
        amount = round(random.uniform(250.0, 5000.0), 2)
        date = (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d")
        
        return f"""{vendor}
123 Industrial Parkway, Suite 500
Warrington, WA1 1BB
Tel: (01925) 555-283 | billing@{vendor.lower().replace(" ", "")}.com

INVOICE

Bill To:
ETOOL Enterprise Customer
789 Developer Lane
London, EC1A 1BB

Invoice Number: {ref_num}
Invoice Date: {date}
Payment Terms: Net 30
Due Date: {(datetime.strptime(date, "%Y-%m-%d") + timedelta(days=30)).strftime("%Y-%m-%d")}

Description                               Qty      Unit Price        Amount
---------------------------------------------------------------------------
1. CAD-to-PDF Conversion Services          25      $ 120.00       $ 3000.00
2. 3D Model Optimization (STL/STEP)        1       $  450.50       $  450.50
3. Compliance Verification Reporting       1       $  500.00       $  500.00

---------------------------------------------------------------------------
Subtotal:                                                         $ 3950.50
Tax (VAT 10%):                                                    $  395.05
Total Due:                                                        $ {amount}

Thank you for your business! Please remit payments to the bank account above.
"""

    elif "contract" in lower_filename or "agreement" in lower_filename or "nda" in lower_filename:
        client = "Alpha Engineering Group"
        date = (datetime.now() - timedelta(days=15)).strftime("%B %d, %Y")
        return f"""MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on this {date} ("Effective Date"), by and between:

Party A: ETOOL Solutions Inc., having its principal place of business at 789 Developer Lane, London, UK.
Party B: {client}, having its principal place of business at 456 Innovation Way, Suite 100.

WHEREAS, the Parties wish to explore a potential business relationship in connection with CAD conversion and document revision tools (the "Transaction"); and

WHEREAS, in the course of such exploration, each Party may disclose to the other Party certain confidential and proprietary technical and business information.

NOW, THEREFORE, the Parties agree as follows:
1. Confidential Information. "Confidential Information" refers to any proprietary info disclosed by either party including drawings, source code, data, and models.
2. Obligation of Confidentiality. Both Parties agree to hold Confidential Information in strict confidence and use it solely for the Transaction.
3. Term. This Agreement shall remain in effect for a period of five (5) years from the Effective Date.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

Signed for Party A:                       Signed for Party B:
Name: John Doe                            Name: Sarah Smith
Title: CEO, ETOOL                         Title: Representative, {client}
"""

    elif "spec" in lower_filename or "technical" in lower_filename or "document" in lower_filename:
        date = datetime.now().strftime("%Y-%m-%d")
        return f"""TECHNICAL SPECIFICATION DOCUMENT
Document Ref: SPEC-2026-T90
Date: {date}
Author: Engineering Design Team

SECTION 1: STRUCTURAL ANALYSIS SPECIFICATIONS
- Project Name: ETOOL Structural Frame Revision
- Material Grade: Structural Steel Grade S355JR
- Minimum Yield Strength: 355 MPa
- Ultimate Tensile Strength: 470 - 630 MPa
- Modulus of Elasticity: 210 GPa

SECTION 2: LOADING AND BOUNDARY CONDITIONS
1. Dead Load (DL): Permanent fixtures 1.5 kN/m²
2. Live Load (LL): 3.0 kN/m² operational load
3. Wind Load (WL): Eurocode BS EN 1991-1-4 (800N capacity)
4. Thermal Expansion Tolerance: ±1.2mm

SECTION 3: CERTIFICATION & COMPLIANCE
The frame must comply with Eurocode 3 (EN 1993) for steel structures and receive ISO 9001 certification.
"""
    else:
        date = datetime.now().strftime("%Y-%m-%d")
        return f"""Starbucks Coffee #1209
456 Market Street
Warrington, WA1 2AA
Tel: (01925) 987-654

Transaction: TXN-{uuid.uuid4().hex[:6].upper()}
Date: {date} 10:45 AM

1  Grande Latte                   $  4.75
1  Blueberry Scone                $  3.50
1  Engineering Notebook           $  8.99

Subtotal                          $ 17.24
Tax (8.5%)                        $  1.47
Total Paid                        $ 18.71

Payment Method: Visa ending in 4321
Auth Code: 09182C
Thank you for visiting!
"""

def parse_simulated_text(text: str, filename: str) -> dict:
    doc_type = "Invoice"
    lower_text = text.lower()
    lower_filename = filename.lower()
    
    if "receipt" in lower_text or "receipt" in lower_filename:
        doc_type = "Receipt"
    elif "contract" in lower_text or "agreement" in lower_text or "nda" in lower_text or "contract" in lower_filename or "agreement" in lower_filename:
        doc_type = "Contract"
    elif "specification" in lower_text or "technical spec" in lower_text or "spec" in lower_text or "spec" in lower_filename:
        doc_type = "Spec"
    
    # Date Extract
    date_patterns = [
        r'\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b',
        r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b',
        r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b'
    ]
    date_issued = None
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            date_issued = match.group(0)
            break
    if not date_issued:
        date_issued = datetime.now().strftime("%Y-%m-%d")
        
    # Ref Code Extract
    ref_pattern = r'(?:Invoice|Ref|Reference|Order|PO|Contract|No|ID|Transaction)\s*(?:#|No\.?|Num\.?|Number)?\s*[:\-]?\s*([A-Za-z0-9\-]+)'
    ref_match = re.search(ref_pattern, text, re.IGNORECASE)
    reference_number = ref_match.group(1) if ref_match else f"REF-{uuid.uuid4().hex[:6].upper()}"
    
    # Amount Extract
    currency = "GBP"
    amount = 0.0
    
    money_pattern = r'(?:\$|€|£|USD|EUR|GBP)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
    money_match = re.search(money_pattern, text)
    if money_match:
        try:
            amount = float(money_match.group(1).replace(",", ""))
        except:
            pass
        matched_sign = money_match.group(0)
        if "$" in matched_sign:
            currency = "USD"
        elif "€" in matched_sign:
            currency = "EUR"
    else:
        total_pattern = r'(?:Total|Price|Amount|Due)\s*[:\-]?\s*(\d+(?:\.\d{2})?)'
        total_match = re.search(total_pattern, text, re.IGNORECASE)
        if total_match:
            try:
                amount = float(total_match.group(1))
            except:
                pass
                
    # Vendor Extract
    vendor = "Unknown Vendor"
    vendor_pattern = r'(?:Vendor|Seller|From|Company|Issuer|Client):\s*([^\n]+)'
    vendor_match = re.search(vendor_pattern, text, re.IGNORECASE)
    if vendor_match:
        vendor = vendor_match.group(1).strip()
    else:
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        for line in lines[:3]:
            if any(suffix in line for suffix in ["Inc", "LLC", "Corp", "Ltd", "Co", "Coffee"]):
                vendor = line
                break
        if vendor == "Unknown Vendor" and len(lines) > 0:
            vendor = lines[0]

    return {
        "file_type": doc_type,
        "vendor": vendor,
        "date_issued": date_issued,
        "reference_number": reference_number,
        "amount": amount,
        "currency": currency
    }

@app.post("/api/ocr/process")
async def ocr_process(
    file: UploadFile = File(...), 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        # Read file contents (or simulate if file is empty or non-text)
        content_bytes = await file.read()
        raw_text = ""
        try:
            raw_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            # Fallback to simulation if binary or parsing fails
            raw_text = generate_simulated_file(file.filename)
            
        if not raw_text.strip():
            raw_text = generate_simulated_file(file.filename)
            
        parsed_fields = parse_simulated_text(raw_text, file.filename)
        
        doc = Document(
            user_id=user.id,
            file_name=file.filename,
            file_type=parsed_fields["file_type"],
            vendor=parsed_fields["vendor"],
            date_issued=parsed_fields["date_issued"],
            reference_number=parsed_fields["reference_number"],
            amount=parsed_fields["amount"],
            currency=parsed_fields["currency"],
            raw_text=raw_text,
            synced_to_crm=False
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        log_action(db, user.id, "OCR Process", f"Successfully processed file: {file.filename}")
        
        return {
            "status": 200,
            "message": "Document processed successfully",
            "document": {
                "id": doc.id,
                "file_name": doc.file_name,
                "file_type": doc.file_type,
                "vendor": doc.vendor,
                "date_issued": doc.date_issued,
                "reference_number": doc.reference_number,
                "amount": doc.amount,
                "currency": doc.currency,
                "raw_text": doc.raw_text,
                "synced_to_crm": doc.synced_to_crm
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ocr/processed")
def get_processed_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == user.id).order_by(Document.created_at.desc()).all()
    return {"status": 200, "documents": [
        {
            "id": d.id,
            "file_name": d.file_name,
            "file_type": d.file_type,
            "vendor": d.vendor,
            "date_issued": d.date_issued,
            "reference_number": d.reference_number,
            "amount": d.amount,
            "currency": d.currency,
            "raw_text": d.raw_text,
            "synced_to_crm": d.synced_to_crm
        } for d in docs
    ]}

@app.delete("/api/ocr/processed/{doc_id}")
def delete_document(doc_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    log_action(db, user.id, "Delete Document", f"Deleted document ID {doc_id}")
    return {"status": 200, "message": "Document deleted successfully"}

@app.post("/api/ocr/processed/{doc_id}/link-crm")
def link_doc_to_crm(doc_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if a CRM Contact already exists for this vendor
    contact = db.query(CRMContact).filter(CRMContact.user_id == user.id, CRMContact.name == doc.vendor).first()
    if not contact:
        contact = CRMContact(
            user_id=user.id,
            name=doc.vendor or "New Synced Contact",
            company=doc.vendor,
            notes=f"Created via IDP sync. Reference: {doc.reference_number}, Amount: {doc.currency} {doc.amount}"
        )
        db.add(contact)
    else:
        contact.notes = (contact.notes or "") + f"\nLinked Invoice: {doc.reference_number} ({doc.currency} {doc.amount})"
    
    doc.synced_to_crm = True
    db.commit()
    log_action(db, user.id, "CRM Sync", f"Synced document ID {doc_id} to CRM contact: {contact.name}")
    return {"status": 200, "message": "Document synced to CRM successfully"}

# --- CRM Contacts CRUD Endpoints ---

@app.get("/api/crm/contacts")
def get_contacts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contacts = db.query(CRMContact).filter(CRMContact.user_id == user.id).all()
    return {"status": 200, "contacts": [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "company": c.company,
            "title": c.title,
            "status": c.status,
            "notes": c.notes,
            "last_contacted": c.last_contacted
        } for c in contacts
    ]}

@app.post("/api/crm/contacts")
def create_contact(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    name = data.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
        
    contact = CRMContact(
        user_id=user.id,
        name=name,
        email=data.get("email"),
        phone=data.get("phone"),
        company=data.get("company"),
        title=data.get("title"),
        status=data.get("status", "active"),
        notes=data.get("notes"),
        last_contacted=data.get("last_contacted")
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    log_action(db, user.id, "Create Contact", f"Created CRM contact: {name}")
    return {"status": 200, "message": "Contact created successfully", "contact": {
        "id": contact.id, "name": contact.name, "email": contact.email
    }}

@app.put("/api/crm/contacts/{contact_id}")
def update_contact(contact_id: int, data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contact = db.query(CRMContact).filter(CRMContact.id == contact_id, CRMContact.user_id == user.id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    contact.name = data.get("name", contact.name)
    contact.email = data.get("email", contact.email)
    contact.phone = data.get("phone", contact.phone)
    contact.company = data.get("company", contact.company)
    contact.title = data.get("title", contact.title)
    contact.status = data.get("status", contact.status)
    contact.notes = data.get("notes", contact.notes)
    contact.last_contacted = data.get("last_contacted", contact.last_contacted)
    
    db.commit()
    log_action(db, user.id, "Update Contact", f"Updated CRM contact: {contact.name}")
    return {"status": 200, "message": "Contact updated successfully"}

@app.delete("/api/crm/contacts/{contact_id}")
def delete_contact(contact_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contact = db.query(CRMContact).filter(CRMContact.id == contact_id, CRMContact.user_id == user.id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    name = contact.name
    db.delete(contact)
    db.commit()
    log_action(db, user.id, "Delete Contact", f"Deleted CRM contact: {name}")
    return {"status": 200, "message": "Contact deleted successfully"}

# --- PayPal Simulated Payment ---

@app.post("/api/paypal/create-order")
def paypal_create_order(data: dict, user: User = Depends(get_current_user)):
    plan_name = data.get("planName", "Standard Plan")
    amount = "9.99" if plan_name == "Standard Plan" else "29.99"
    # Return mock PayPal Order ID
    return {
        "status": 200,
        "orderID": f"PAY-{uuid.uuid4().hex[:12].upper()}",
        "amount": amount,
        "currency": "GBP"
    }

@app.post("/api/paypal/execute-payment")
def paypal_execute_payment(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order_id = data.get("orderID")
    plan_name = data.get("planName", "Standard Plan")
    
    if not order_id:
        raise HTTPException(status_code=400, detail="Missing orderID")
        
    user.subscription_plan = plan_name
    db.commit()
    
    log_action(db, user.id, "Billing Upgrade", f"Upgraded to {plan_name} via PayPal transaction {order_id}")
    return {
        "status": 200,
        "message": "Payment executed successfully",
        "subscription_plan": user.subscription_plan
    }

# --- Dashboard & Health Endpoints ---

@app.get("/api/dashboard/stats")
def get_dashboard_stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc_count = db.query(Document).filter(Document.user_id == user.id).count()
    crm_count = db.query(CRMContact).filter(CRMContact.user_id == user.id).count()
    recent_logs = db.query(AuditLog).filter(AuditLog.user_id == user.id).order_by(AuditLog.timestamp.desc()).limit(5).all()
    
    # Calculate mock metrics
    success_rate = 98.4 if doc_count > 0 else 100.0
    rem_time = "1.2s" if doc_count > 0 else "0.0s"
    
    return {
        "status": 200,
        "stats": {
            "document_count": doc_count,
            "crm_count": crm_count,
            "subscription_plan": user.subscription_plan,
            "success_rate": success_rate,
            "remediation_time": rem_time,
            "recent_activity": [
                {
                    "action": log.action,
                    "details": log.details,
                    "timestamp": log.timestamp.isoformat()
                } for log in recent_logs
            ]
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ETOOL FastAPI Server"}
