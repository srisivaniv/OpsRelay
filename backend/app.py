
from flask import Flask, jsonify
from flask_cors import CORS

from routes.reports import reports_bp
from routes.questions import questions_bp
from routes.issues import issues_bp


app = Flask(__name__)

# Enable frontend communication
CORS(app)

# Register API routes
app.register_blueprint(
    reports_bp,
    url_prefix="/api"
)

app.register_blueprint(
    questions_bp,
    url_prefix="/api"
)

app.register_blueprint(
    issues_bp,
    url_prefix="/api"
)


# Home route
@app.route("/")
def home():

    return jsonify({
        "project": "OpsRelay",
        "message": "Business Memory System Backend",
        "status": "Running"
    })


# Health check
@app.route("/api/health")
def health():

    return jsonify({
        "status": "success",
        "message": "OpsRelay Backend is working"
    })


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )