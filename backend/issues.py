
from flask import Blueprint, request, jsonify
from .hindsight_service import hindsight

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/issues/patterns", methods=["GET"])
async def find_patterns():

    machine = request.args.get("machine")

    try:
        result = await hindsight.identify_patterns(machine)

        return jsonify({
            "machine": machine or "All machines",
            "patterns": result,
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Unable to identify patterns",
            "details": str(e)
        }), 503


@issues_bp.route("/tasks", methods=["GET"])
async def get_pending_tasks():

    try:
        memories = await hindsight.recall_memory(
            "Find all stored shift reports for machines with unresolved, pending, or monitoring issues. Include the machine, problem, employee, action taken, and current status."
        )

        return jsonify({
            "tasks": memories,
            "count": len(memories),
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Unable to retrieve pending tasks",
            "details": str(e)
        }), 503
