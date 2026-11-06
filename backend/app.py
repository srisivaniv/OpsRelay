
from flask import Flask, jsonify,request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to OpsRelay Backend",
        "status": "Running"
    })

@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is working!"
    })


@app.route("/api/reports", methods=["POST"])
def submit_report():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No report data provided"
        }), 400

    report = {
        "employee": data.get("employee"),
        "shift": data.get("shift"),
        "machine": data.get("machine"),
        "issue": data.get("issue"),
        "action_taken": data.get("action_taken"),
        "status": data.get("status", "Unresolved")
    }

    return jsonify({
        "message": "Shift report received successfully!",
        "report": report
    }), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)