# app.py - OPTIMIZED VERSION
import os
import time
import logging
import threading
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import numpy as np

# Blueprint imports
from auth.routes import auth_bp

# Optional student/teacher blueprints
try:
    from student.registration import student_registration_bp
except ImportError:
    student_registration_bp = None

try:
    from student.updatedetails import student_update_bp
except ImportError:
    student_update_bp = None

try:
    from student.demo_session import demo_session_bp
except ImportError:
    demo_session_bp = None

try:
    from student.view_attendance import attendance_bp
except ImportError:
    attendance_bp = None

try:
    from teacher.attendance_records import attendance_session_bp
except ImportError:
    attendance_session_bp = None

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DATABASE_NAME", "attendease_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "students")
THRESHOLD = float(os.getenv("THRESHOLD", "0.6"))

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
students_collection = db[COLLECTION_NAME]
attendance_db = client["attendease_attendance"]
attendance_collection = attendance_db["attendance_records"]

# OPTIMIZED MODEL MANAGER CLASS
class ModelManager:
    """
    Singleton class to manage face recognition models
    Ensures models are loaded only once and shared across all requests
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialize_models()
        return cls._instance

    def _initialize_models(self):
        """Initialize all face recognition models with proper error handling"""
        logger.info("🤖 Starting model initialization...")
        start_time = time.time()

        self.models_ready = False
        self.detector = None
        self.deepface_ready = False

        try:
            # 1. Initialize MTCNN detector with optimized parameters
            from mtcnn import MTCNN
            logger.info("Loading MTCNN detector...")
            self.detector = MTCNN()
            logger.info("✅ MTCNN detector loaded successfully")

            # 2. Preload DeepFace model properly
            from deepface import DeepFace
            logger.info("Warming up DeepFace Facenet512 model...")

            # Force model download and initialization with dummy prediction
            dummy_img = np.zeros((160, 160, 3), dtype=np.uint8)

            # This forces the model to be downloaded and cached
            _ = DeepFace.represent(
                dummy_img, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            # Additional warm-up with different image size
            dummy_img_2 = np.ones((224, 224, 3), dtype=np.uint8) * 128
            _ = DeepFace.represent(
                dummy_img_2, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            self.deepface_ready = True
            logger.info("✅ DeepFace Facenet512 model warmed up successfully")

            self.models_ready = True

            initialization_time = time.time() - start_time
            logger.info(f"🎉 All models initialized successfully in {initialization_time:.2f} seconds")

        except Exception as e:
            logger.error(f"❌ Model initialization failed: {e}")
            logger.warning("Models unavailable - auth/signin endpoints will still work")
            self.models_ready = False
            # Do NOT re-raise - allow app to start without face recognition

    def get_detector(self):
        """Get the MTCNN detector instance"""
        if not self.models_ready or self.detector is None:
            return None
        return self.detector

    def is_ready(self):
        """Check if all models are ready"""
        return self.models_ready and self.deepface_ready

    def health_check(self):
        """Perform model health check"""
        try:
            if not self.models_ready:
                return False

            # Test MTCNN
            test_img = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
            _ = self.detector.detect_faces(test_img)

            # Test DeepFace
            from deepface import DeepFace
            test_face = np.random.randint(0, 255, (160, 160, 3), dtype=np.uint8)
            _ = DeepFace.represent(
                test_face, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            return True

        except Exception as e:
            logger.error(f"Model health check failed: {e}")
            return False

# Initialize the model manager (singleton) - non-fatal if models unavailable
logger.info("Initializing Model Manager...")
try:
    model_manager = ModelManager()
except Exception as e:
    logger.warning(f"ModelManager could not fully initialize: {e}")
    model_manager = None

# Flask app
app = Flask(__name__)
CORS(app)

# Configure Flask app with database and model instances
app.config["DB"] = db
app.config["COLLECTION_NAME"] = COLLECTION_NAME
app.config["THRESHOLD"] = THRESHOLD
app.config["ATTENDANCE_COLLECTION"] = attendance_collection

# Pass model manager to Flask config so blueprints can access it
app.config["MODEL_MANAGER"] = model_manager
app.config["MTCNN_DETECTOR"] = model_manager.get_detector() if model_manager else None

bcrypt = Bcrypt(app)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify model status"""
    if not model_manager:
        return {
            "status": "degraded",
            "models_ready": False,
            "models_healthy": False,
            "note": "ModelManager not initialized — auth/signin still operational",
            "timestamp": time.time()
        }

    model_status = model_manager.is_ready()
    model_health = model_manager.health_check()

    return {
        "status": "healthy" if model_status and model_health else "unhealthy",
        "models_ready": model_status,
        "models_healthy": model_health,
        "timestamp": time.time()
    }

# Register blueprints
app.register_blueprint(auth_bp)

if student_registration_bp:
    app.register_blueprint(student_registration_bp)
    logger.info("✅ Student registration blueprint registered")

if student_update_bp:
    app.register_blueprint(student_update_bp)
    logger.info("✅ Student update blueprint registered")

if demo_session_bp:
    app.register_blueprint(demo_session_bp)
    logger.info("✅ Demo session blueprint registered")

if attendance_bp:
    app.register_blueprint(attendance_bp)
    logger.info("✅ Attendance blueprint registered")

if attendance_session_bp:
    app.register_blueprint(attendance_session_bp)
    logger.info("✅ Attendance session blueprint registered")

# List all registered routes
logger.info("\nRegistered Flask Routes:")
for rule in app.url_map.iter_rules():
    logger.info(f"  {rule}")

if __name__ == "__main__":
    logger.info("🚀 Starting Flask server...")

    # Check model readiness (non-fatal - auth still works without models)
    if model_manager and model_manager.is_ready():
        logger.info("🎯 AttendEase PRO is ready! Server starting on http://0.0.0.0:5001")
    else:
        logger.warning("⚠️  Face recognition models not ready - auth/signin will still work")

    app.run(host="0.0.0.0", port=5001, debug=False)