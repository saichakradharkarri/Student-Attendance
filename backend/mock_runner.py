import sys
import os
import logging
from unittest.mock import MagicMock
from flask import Flask

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mock_runner")

# --- MOCKING MONGO ---
class MockCursor(list):
    """A list subclass that simulates PyMongo cursor methods like limit and sort."""
    def limit(self, limit_count):
        if limit_count <= 0:
            return self
        return MockCursor(self[:limit_count])
        
    def sort(self, key_or_list, direction=1):
        if not self:
            return self
        if not isinstance(key_or_list, list):
            sort_spec = [(key_or_list, direction)]
        else:
            sort_spec = key_or_list
            
        key_field = sort_spec[0][0]
        reverse_sort = (sort_spec[0][1] < 0)
        
        # Sort using the first key provided
        sorted_list = sorted(self, key=lambda x: str(x.get(key_field, "")), reverse=reverse_sort)
        return MockCursor(sorted_list)

class MockCollection:
    """Persistent in-memory mock collection - data survives between calls."""
    def __init__(self, name):
        self.name = name
        self.data = []

    def find_one(self, query=None, projection=None):
        logger.info(f"Mock DB: find_one in '{self.name}' for {query}")
        if not query:
            return self.data[0] if self.data else None

        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                # Apply projection (exclude fields marked as 0)
                if projection:
                    return {key: val for key, val in doc.items() if projection.get(key, 1) != 0}
                return doc
        return None

    def insert_one(self, doc):
        logger.info(f"Mock DB: insert_one into '{self.name}': {list(doc.keys())}")
        doc = doc.copy()  # Don't mutate original
        doc['_id'] = "mock_id_" + str(len(self.data))
        self.data.append(doc)

        # Return an object with inserted_id attribute
        class InsertResult:
            inserted_id = doc['_id']
        return InsertResult()

    def count_documents(self, query=None):
        return len(self.find(query or {}))

    def distinct(self, field):
        return list(set(doc.get(field) for doc in self.data if field in doc))

    def _matches_query(self, doc, query):
        """Check if a document matches a query including nested field queries."""
        for k, v in query.items():
            if '.' in k:
                # Nested field query like "students.student_id"
                parts = k.split('.', 1)
                arr = doc.get(parts[0], [])
                if isinstance(arr, list):
                    # Check if any element in the array has the nested field matching v
                    if not any(elem.get(parts[1]) == v for elem in arr if isinstance(elem, dict)):
                        return False
                else:
                    return False
            elif isinstance(v, dict) and '$exists' in v:
                field_exists = k in doc and doc[k] is not None
                if v.get('$exists') and not field_exists:
                    return False
                if not v.get('$exists') and field_exists:
                    return False
            elif isinstance(v, dict) and '$ne' in v:
                if doc.get(k) == v['$ne']:
                    return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    def find(self, query=None, projection=None, **kwargs):
        """Return all matching documents, optionally applying projection."""
        if not query:
            results = list(self.data)
        else:
            results = [doc for doc in self.data if self._matches_query(doc, query)]
            
        if not projection:
            return results
            
        # Apply projection
        projected_results = []
        for doc in results:
            projected_doc = {}
            # If all values are 1 (except possibly _id: 0), include only those fields
            # Simplified projection logic:
            for k, v in doc.items():
                if projection.get(k, 1) != 0:
                    projected_doc[k] = v
            projected_results.append(projected_doc)
            
        return MockCursor(projected_results)

    def update_one(self, query, update, upsert=False):
        """Update first matching document, supporting $set and $push operators."""
        # Find matching doc using enhanced matcher
        matched = None
        for doc in self.data:
            if self._matches_query(doc, query):
                matched = doc
                break

        class UpdateResult:
            def __init__(self, matched, modified):
                self.matched_count = matched
                self.modified_count = modified

        if matched is not None:
            modified = False
            if '$set' in update:
                for k, v in update['$set'].items():
                    if '.' in k:
                        # Handle nested set like "students.$.present"
                        parts = k.split('.')
                        if len(parts) == 3 and parts[1] == '$':
                            arr_field = parts[0]
                            sub_field = parts[2]
                            arr = matched.get(arr_field, [])
                            # Find the matching nested element from query
                            for elem in arr:
                                if isinstance(elem, dict):
                                    for qk, qv in query.items():
                                        if '.' in qk:
                                            qparts = qk.split('.', 1)
                                            if qparts[0] == arr_field and elem.get(qparts[1]) == qv:
                                                elem[sub_field] = v
                                                modified = True
                    else:
                        if matched.get(k) != v:
                            matched[k] = v
                            modified = True
            if '$push' in update:
                for k, v in update['$push'].items():
                    if k not in matched:
                        matched[k] = []
                    matched[k].append(v)
                    modified = True
            return UpdateResult(1, 1 if modified else 0)
        elif upsert:
            new_doc = {}
            new_doc.update(query)
            if '$set' in update:
                new_doc.update(update['$set'])
            self.insert_one(new_doc)
            return UpdateResult(1, 1)
        return UpdateResult(0, 0)

    def delete_one(self, query):
        for doc in self.data:
            if self._matches_query(doc, query):
                self.data.remove(doc)
                return


class MockDB:
    """Persistent database — same collection name always returns the same object."""
    def __init__(self):
        self._collections = {}

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        if name not in self._collections:
            self._collections[name] = MockCollection(name)
        return self._collections[name]

    def __getitem__(self, name):
        if name not in self._collections:
            self._collections[name] = MockCollection(name)
        return self._collections[name]


class MockMongoClient:
    """Mock MongoDB client that returns the same persistent MockDB."""
    def __init__(self, *args, **kwargs):
        self._dbs = {}

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        if name not in self._dbs:
            self._dbs[name] = MockDB()
        return self._dbs[name]

    def __getitem__(self, name):
        if name not in self._dbs:
            self._dbs[name] = MockDB()
        return self._dbs[name]


# Inject Mock MongoClient BEFORE importing anything else
sys.modules['pymongo'] = MagicMock()
sys.modules['pymongo'].MongoClient = MockMongoClient

# --- MOCKING FACE RECOGNITION ---
class MockMTCNN:
    def __init__(self, *args, **kwargs):
        pass
    def detect_faces(self, img):
        # Return a realistic face detection for any image
        return [{
            'box': [10, 10, 100, 100],
            'confidence': 0.99,
            'keypoints': {'left_eye': (40, 40), 'right_eye': (70, 40), 'nose': (55, 60)}
        }]

class MockDeepFace:
    @staticmethod
    def represent(*args, **kwargs):
        return [{"embedding": [0.1] * 512}]

    @staticmethod
    def analyze(*args, **kwargs):
        return [{"dominant_emotion": "happy", "age": 25, "gender": "Man"}]

    @staticmethod
    def verify(*args, **kwargs):
        return {"verified": True, "distance": 0.3}

mock_mtcnn_module = MagicMock()
mock_mtcnn_module.MTCNN = MockMTCNN
sys.modules['mtcnn'] = mock_mtcnn_module

mock_deepface_module = MagicMock()
mock_deepface_module.DeepFace = MockDeepFace
sys.modules['deepface'] = mock_deepface_module

# Also mock numpy (in case of version issues)
try:
    import numpy as np
except ImportError:
    sys.modules['numpy'] = MagicMock()

# Mock PIL
try:
    from PIL import Image
except ImportError:
    sys.modules['PIL'] = MagicMock()

# Mock bson
try:
    from bson.objectid import ObjectId
except ImportError:
    mock_bson = MagicMock()
    sys.modules['bson'] = mock_bson
    sys.modules['bson.objectid'] = mock_bson

# --- START APP ---
try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

    # Import app - ModelManager will use mocked mtcnn/deepface
    from app import app

    # Use a SINGLE shared persistent MockDB instance
    mock_client = MockMongoClient()
    mock_db = mock_client["facerecognition"]

    # Override DB in app config with our persistent mock
    app.config["DB"] = mock_db
    app.config["ATTENDANCE_COLLECTION"] = mock_db["attendance_records"]

    logger.info("✅ Mock DB collections initialized and persistent")
    logger.info("🚀 MOCKED AUTH/DB READY - Starting server on http://localhost:5001")
    logger.info("   Signup and Signin will work correctly in memory.")

    app.run(host="127.0.0.1", port=5001, debug=False)

except Exception as e:
    logger.error(f"Failed to start mock server: {e}")
    import traceback
    traceback.print_exc()
