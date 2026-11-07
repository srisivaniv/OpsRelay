
from flask import Flask, jsonify, render_template
from flask_cors import CORS

from backend.reports import reports_bp
from backend.questions import questions_bp
from backend.issues import issues_bp

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

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

# Frontend page routes

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/report")
def report():
    return render_template("report.html")


@app.route("/assistant")
def assistant():
    return render_template("assistant.html")


@app.route("/history")
def history():
    return render_template("history.html")


@app.route("/recurring")
def recurring():
    return render_template("recurring.html")


@app.route("/tasks")
def tasks():
    return render_template("tasks.html")


@app.route("/timeline")
def timeline():
    return render_template("timeline.html")


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )