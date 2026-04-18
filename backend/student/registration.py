from flask import Blueprint, request, jsonify, current_app
import time
import base64
import logging
import io

student_registration_bp = Blueprint("student_registration", __name__)
logger = logging.getLogger(__name__)


def read_image_from_bytes(b):
    from PIL import Image
    import numpy as np
    img = Image.open(io.BytesIO(b)).convert('RGB')
    return np.array(img)


def detect_faces_rgb(rgb_image):
    model_manager = current_app.config.get("MODEL_MANAGER")
    if model_manager and model_manager.is_ready():
        detector = model_manager.get_detector()
    else:
        # Fallback: try getting detector directly from config
        detector = current_app.config.get("MTCNN_DETECTOR")

    if not detector:
        raise RuntimeError("Face detector not available")

    detections = detector.detect_faces(rgb_image)
    faces = []
    for d in detections:
        # Lowered to match attendance tracking thresholds (0.65)
        if d['confidence'] > 0.65:
            x, y, w, h = d['box']
            x, y = max(0, x), max(0, y)
            # Lower minimum face size to 25px
            if w > 25 and h > 25:
                face_rgb = rgb_image[y:y+h, x:x+w]
                faces.append({'box': (x, y, w, h), 'face': face_rgb, 'confidence': d['confidence']})
    return faces


def extract_embedding(face_rgb):
    from deepface import DeepFace
    import numpy as np
    try:
        from PIL import Image
        face_pil = Image.fromarray(face_rgb.astype('uint8')).resize((160, 160))
        face_array = np.array(face_pil)
        rep = DeepFace.represent(face_array, model_name='Facenet512', detector_backend='skip')
        return np.array(rep[0]['embedding'], dtype=float)
    except Exception as e:
        logger.error(f"Embedding error: {e}")
        return None


@student_registration_bp.route('/api/register-student', methods=['POST'])
def register_student():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON data"}), 400

    db = current_app.config.get("DB")
    students_col = db.students

    # Check required fields
    required_fields = ['studentName', 'studentId', 'department', 'year', 'division', 'semester', 'email', 'phoneNumber', 'images']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"success": False, "error": f"{field} is required"}), 400

    # Check uniqueness of studentId and email
    if students_col.find_one({'studentId': data['studentId']}):
        return jsonify({"success": False, "error": "Student ID already exists"}), 400
    if students_col.find_one({'email': data['email']}):
        return jsonify({"success": False, "error": "Email already registered"}), 400

    # Validate images
    images = data.get('images')
    if not isinstance(images, list) or len(images) != 5:
        return jsonify({"success": False, "error": "Exactly 5 images are required"}), 400

    embeddings = []
    for idx, img_b64 in enumerate(images):
        try:
            if img_b64.startswith("data:"):
                img_b64 = img_b64.split(",", 1)[1]
            rgb = read_image_from_bytes(base64.b64decode(img_b64))
        except Exception:
            return jsonify({"success": False, "error": f"Invalid image data at index {idx}"}), 400

        try:
            faces = detect_faces_rgb(rgb)
        except RuntimeError as e:
            return jsonify({"success": False, "error": str(e)}), 503

        if len(faces) != 1:
            return jsonify({"success": False, "error": f"Ensure exactly one face in each image (failed at image {idx+1})"}), 400

        emb = extract_embedding(faces[0]['face'])
        if emb is None:
            return jsonify({"success": False, "error": f"Failed to extract face features for image {idx+1}"}), 500
        embeddings.append(emb.tolist())

    student_data = {
        "studentId": data['studentId'],
        "studentName": data['studentName'],
        "department": data['department'],
        "year": data['year'],
        "division": data['division'],
        "semester": data['semester'],
        "email": data['email'],
        "phoneNumber": data['phoneNumber'],
        "status": "active",
        "embeddings": embeddings,
        "face_registered": True,
        "created_at": time.time(),
        "updated_at": time.time()
    }

    result = students_col.insert_one(student_data)
    return jsonify({"success": True, "studentId": data['studentId'], "record_id": str(result.inserted_id)})


@student_registration_bp.route('/api/students/count', methods=['GET'])
def get_student_count():
    db = current_app.config.get("DB")
    return jsonify({"success": True, "count": db.students.count_documents({})})


@student_registration_bp.route('/api/students/departments', methods=['GET'])
def get_departments():
    db = current_app.config.get("DB")
    departments = db.students.distinct("department")
    return jsonify({"success": True, "departments": departments, "count": len(departments)})
