# AttendEase Pro - Advanced AI Attendance System

AttendEase is a next-generation, biometric-driven attendance management platform. Built with a premium dark-themed interface, it leverages high-precision face recognition to automate presence tracking for modern institutions.

![AttendEase Hero](Project%20Snap/1.PNG)

## 🚀 Core Features

- **Neural Recognition Engine**: Powered by MTCNN and Facenet512 for military-grade facial verification.
- **Real-time Synchronization**: Instant data sync between the Next.js frontend and Flask backend.
- **Glassmorphism UI**: A stunning, modern interface with smooth animations and responsive layouts.
- **Role-Based Access**: Specialized dashboards for both teachers and students.
- **Enterprise Security**: Secure session handling and encrypted biometric data storage.

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Flask 3.0, PyMongo, Flask-CORS
- **AI/ML**: MTCNN (Face Detection), DeepFace (Embeddings/Verification)
- **Database**: MongoDB Atlas

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB Atlas Account

### 1. Backend Configuration
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_atlas_uri
DATABASE_NAME=facerecognition
COLLECTION_NAME=students
THRESHOLD=0.6
```

### 2. Frontend Configuration
```bash
cd frontend
npm install
```

### 3. Running the System
**Start Backend:**
```bash
python app.py
```
**Start Frontend:**
```bash
npm run dev
```

## 🔐 Security & Ethics
AttendEase is designed with privacy-first protocols. Biometric embeddings are stored as hashed vectors, ensuring that raw facial data is never exposed.

---
© 2026 AttendEase Solutions. All rights reserved.
