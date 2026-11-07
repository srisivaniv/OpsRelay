
from flask import Blueprint, request, jsonify
from .hindsight_service import hindsight

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/issues/patterns", methods=["GET"])
def find_patterns():

    machine = request.args.get("machine")

    try:

        result = hindsight.identify_patterns(machine)

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