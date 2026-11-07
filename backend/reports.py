
from flask import Blueprint, request, jsonify
from .hindsight_service import hindsight
from datetime import datetime, timezone
import uuid

reports_bp = Blueprint("reports", __name__)

# Submit a shift report
@reports_bp.route("/reports", methods=["POST"])
async def submit_report():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "JSON data is required"
        }), 400

    required_fields = [
        "employee",
        "shift",
        "machine",
        "issue",
        "action_taken"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    report = {
        "report_id": str(uuid.uuid4()),
        "employee": data["employee"],
        "shift": data["shift"],
        "machine": data["machine"],
        "issue": data["issue"],
        "action_taken": data["action_taken"],
        "status": data.get("status", "Unresolved"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    try:
        await hindsight.retain_report(report)

        return jsonify({
            "message": "Report received and sent to memory",
            "report": report
        }), 201

    except Exception as e:

        return jsonify({
            "error": "Report could not be stored in Hindsight",
            "report_id": report["report_id"],
            "details": str(e)
        }), 503