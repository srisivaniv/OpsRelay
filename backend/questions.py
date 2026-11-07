
from flask import Blueprint, request, jsonify
from .hindsight_service import hindsight

questions_bp = Blueprint("questions", __name__)


@questions_bp.route("/ask", methods=["POST"])
def ask_question():

    data = request.get_json(silent=True)

    if not data or not data.get("question"):
        return jsonify({
            "error": "Please provide a question"
        }), 400

    question = data["question"]

    try:

        answer = hindsight.reflect_memory(question)

        return jsonify({
            "question": question,
            "answer": answer,
            "status": "success"
        }), 200

    except Exception as e:

        return jsonify({
            "error": "Unable to retrieve an answer",
            "details": str(e)
        }), 503


@questions_bp.route("/recall", methods=["POST"])
def recall_question():

    data = request.get_json(silent=True)

    if not data or not data.get("question"):
        return jsonify({
            "error": "Question is required"
        }), 400

    try:

        memories = hindsight.recall_memory(
            data["question"]
        )

        return jsonify({
            "question": data["question"],
            "memories": memories,
            "status": "success"
        }), 200

    except Exception as e:

        return jsonify({
            "error": "Memory retrieval failed",
            "details": str(e)
        }), 503