import os
import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test database imports
from .database import Base, get_db, User, Document, CRMContact
from .main import app

# Use a file-based SQLite database for tests to prevent connection isolation issues
TEST_DB_FILE = "./test_backend.db"
TEST_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestEToolBackend(unittest.TestCase):
    def setUp(self):
        # Ensure clean test DB
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except:
                pass
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Insert a default user for testing
        db = TestingSessionLocal()
        import hashlib
        self.test_user_email = "test@example.com"
        self.test_user_password = "password123"
        password_hash = hashlib.sha256(self.test_user_password.encode()).hexdigest()
        
        user = User(
            first_name="Test",
            last_name="User",
            email=self.test_user_email,
            password_hash=password_hash,
            subscription_plan="Begin Plan"
        )
        db.add(user)
        db.commit()
        db.close()

    def tearDown(self):
        # Drop tables and remove file
        Base.metadata.drop_all(bind=engine)
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except:
                pass

    def test_signup_success(self):
        payload = {
            "firstName": "Alex",
            "lastName": "Kwesi",
            "email": "alex@example.com",
            "password": "securepassword"
        }
        response = client.post("/api/auth/signup", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["email"], "alex@example.com")
        self.assertIn("session", response.cookies)

    def test_login_success(self):
        payload = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        response = client.post("/api/auth/login", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["email"], self.test_user_email)
        self.assertIn("session", response.cookies)

    def test_login_invalid_password(self):
        payload = {
            "email": self.test_user_email,
            "password": "wrongpassword"
        }
        response = client.post("/api/auth/login", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertNotIn("session", response.cookies)

    def test_health_check(self):
        response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

if __name__ == "__main__":
    unittest.main()
