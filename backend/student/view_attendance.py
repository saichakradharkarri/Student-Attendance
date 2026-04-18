from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import time

attendance_bp = Blueprint("attendance", __name__)

# ------------------------- GET ATTENDANCE -------------------------
@attendance_bp.route('/api/attendance', methods=['GET'])
def get_attendance():
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records
    students_col = db.students

    date = request.args.get('date')
    department = request.args.get('department')
    year = request.args.get('year')
    division = request.args.get('division')
    subject = request.args.get('subject')
    student_id = request.args.get('student_id')

    try:
        # Query attendance collection
        query = {}
        if date: query["date"] = date
        if department: query["department"] = department
        if year: query["year"] = year
        if division: query["division"] = division
        if subject: query["subject"] = subject

        attendance_docs = list(attendance_col.find(query))

        # Build roster from students collection for given class filters
        roster_filter = {}
        if department: roster_filter["department"] = department
        if year: roster_filter["year"] = year
        if division: roster_filter["division"] = division

        roster = list(students_col.find(roster_filter)) if roster_filter else []

        # Map session students by id for quick lookup
        session_map = {}
        # We also want to keep track of common fields like subject/date from the docs
        first_doc = attendance_docs[0] if attendance_docs else None
        
        for doc in attendance_docs:
            for s in doc.get("students", []):
                sid = s.get("student_id")
                if not sid: continue
                # Prioritize present status if multiple sessions exist
                if sid not in session_map or s.get("present"):
                    session_map[sid] = s

        attendance_list = []
        seen_students = set()

        # Merge roster and session students: show present and absent
        for student in roster:
            sid = student.get("studentId") or student.get("student_id")
            if not sid or sid in seen_students:
                continue
            seen_students.add(sid)
            # Apply student_id filter if provided
            if student_id and sid != student_id:
                continue

            sess = session_map.get(sid, None)
            if sess:
                present = bool(sess.get("present"))
                marked_at = sess.get("marked_at")
                # Ensure marked_at is JSON-serializable (string)
                if marked_at is not None:
                    try:
                        # If it's a datetime from Mongo, convert to ISO
                        marked_at = marked_at.isoformat()
                    except Exception:
                        # Fallback to str()
                        marked_at = str(marked_at)
            else:
                present = False
                marked_at = None

            # FIX: append is at the same indent level as if/else (not inside else)
            attendance_list.append({
                "studentId": str(sid) if sid is not None else "",
                "studentName": student.get("studentName") or student.get("student_name"),
                "date": str(first_doc.get("date")) if first_doc else str(date),
                "subject": str(first_doc.get("subject")) if first_doc else str(subject),
                "department": str(first_doc.get("department")) if first_doc else str(department),
                "year": str(first_doc.get("year")) if first_doc else str(year),
                "division": str(first_doc.get("division")) if first_doc else str(division),
                "status": "present" if present else "absent",
                "markedAt": marked_at
            })

        # Also include any session-only students not in roster (fallback)
        for doc in attendance_docs:
            for s in doc.get("students", []):
                sid = s.get("student_id")
                if sid in seen_students:
                    continue
                if student_id and sid != student_id:
                    continue
                seen_students.add(sid)
                # Convert any datetime in s.get('marked_at') to string
                marked = s.get("marked_at")
                if marked is not None:
                    try:
                        marked = marked.isoformat()
                    except Exception:
                        marked = str(marked)

                attendance_list.append({
                    "studentId": str(sid) if sid is not None else "",
                    "studentName": s.get("student_name"),
                    "date": str(doc.get("date")),
                    "subject": str(doc.get("subject")),
                    "department": str(doc.get("department")),
                    "year": str(doc.get("year")),
                    "division": str(doc.get("division")),
                    "status": "present" if s.get("present") else "absent",
                    "markedAt": marked
                })

        # Stats computed against roster size
        student_filter = roster_filter
        total_students = students_col.count_documents(student_filter) if student_filter else len(attendance_list)
        present_count = sum(1 for r in attendance_list if r.get("status") == "present")
        absent_count = max(total_students - present_count, 0)
        attendance_rate = round((present_count / total_students * 100) if total_students > 0 else 0, 1)

        return jsonify({
            "success": True,
            "attendance": attendance_list,
            "stats": {
                "totalStudents": total_students,
                "presentToday": present_count,
                "absentToday": absent_count,
                "attendanceRate": attendance_rate
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ------------------------- LIST ALL SESSIONS -------------------------
@attendance_bp.route('/api/attendance/sessions', methods=['GET'])
def list_sessions():
    """List all attendance sessions with summary stats."""
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records

    department = request.args.get('department')
    year = request.args.get('year')
    division = request.args.get('division')
    limit = int(request.args.get('limit', 50))

    try:
        query = {}
        if department: query["department"] = department
        if year: query["year"] = year
        if division: query["division"] = division

        sessions_raw = list(attendance_col.find(query))
        sessions = []
        for s in sessions_raw[-limit:]:
            students = s.get("students", [])
            present_count = sum(1 for st in students if st.get("present"))
            total_count = len(students)
            created_at = s.get("created_at")
            if created_at and hasattr(created_at, 'isoformat'):
                created_at = created_at.isoformat()
            elif created_at:
                created_at = str(created_at)

            sessions.append({
                "sessionId": str(s.get("_id", "")),
                "date": str(s.get("date", "")),
                "subject": str(s.get("subject", "")),
                "department": str(s.get("department", "")),
                "year": str(s.get("year", "")),
                "division": str(s.get("division", "")),
                "presentCount": present_count,
                "totalStudents": total_count,
                "attendanceRate": round((present_count / total_count * 100) if total_count > 0 else 0, 1),
                "finalized": bool(s.get("finalized", False)),
                "createdAt": created_at
            })

        sessions.reverse()  # Most recent first

        return jsonify({
            "success": True,
            "sessions": sessions,
            "totalSessions": len(sessions)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ------------------------- STUDENT ATTENDANCE SUMMARY -------------------------
@attendance_bp.route('/api/attendance/student-summary', methods=['GET'])
def student_attendance_summary():
    """Get attendance summary for a specific student across all sessions."""
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records

    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"success": False, "error": "student_id required"}), 400

    try:
        all_sessions = list(attendance_col.find({"finalized": True}))
        total = 0
        present = 0
        records = []

        for session in all_sessions:
            for s in session.get("students", []):
                if str(s.get("student_id")) == str(student_id):
                    total += 1
                    is_present = bool(s.get("present"))
                    if is_present:
                        present += 1
                    marked_at = s.get("marked_at")
                    if marked_at and hasattr(marked_at, 'isoformat'):
                        marked_at = marked_at.isoformat()
                    elif marked_at:
                        marked_at = str(marked_at)
                    records.append({
                        "date": str(session.get("date", "")),
                        "subject": str(session.get("subject", "")),
                        "department": str(session.get("department", "")),
                        "status": "present" if is_present else "absent",
                        "markedAt": marked_at
                    })

        attendance_rate = round((present / total * 100) if total > 0 else 0, 1)

        return jsonify({
            "success": True,
            "studentId": student_id,
            "summary": {
                "totalClasses": total,
                "present": present,
                "absent": total - present,
                "attendanceRate": attendance_rate
            },
            "records": sorted(records, key=lambda x: x.get("date", ""), reverse=True)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ------------------------- EXPORT TO EXCEL -------------------------
@attendance_bp.route('/api/attendance/export', methods=['GET'])
def export_attendance():
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records
    students_col = db.students

    date = request.args.get('date')
    department = request.args.get('department')
    year = request.args.get('year')
    division = request.args.get('division')
    subject = request.args.get('subject')

    try:
        # Get attendance doc
        query = {}
        if date: query["date"] = date
        if department: query["department"] = department
        if year: query["year"] = year
        if division: query["division"] = division
        if subject: query["subject"] = subject

        attendance_doc = attendance_col.find_one(query)
        present_set = set()

        if attendance_doc:
            for student in attendance_doc.get("students", []):
                if student.get("present"):
                    present_set.add(student.get("student_id"))

        # Get all students in that class
        student_filter = {}
        if department: student_filter["department"] = department
        if year: student_filter["year"] = year
        if division: student_filter["division"] = division

        students = list(students_col.find(student_filter))
        export_data = []

        for student in students:
            sid = student.get("studentId") or student.get("student_id")
            name = student.get("studentName") or student.get("student_name")
            status = "present" if sid in present_set else "absent"
            export_data.append({
                "studentId": str(sid) if sid is not None else "",
                "name": name,
                "subject": str(subject) if subject else "N/A",
                "date": str(date) if date else "N/A",
                "status": status
            })

        return jsonify({"success": True, "data": export_data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500