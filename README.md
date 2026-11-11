# OpsRelay – AI-Powered Business Memory System

**Helping teams preserve operational knowledge across employee shifts.**

OpsRelay is an AI-powered operational memory system designed to solve a common workplace problem: important information can get lost when employees change shifts.

It uses **Hindsight** to retain, recall and reflect on previous shift reports, helping employees understand past incidents, retrieve unresolved information and identify recurring problems.

## Project Overview

In workplaces where employees work in different shifts, important machine updates, maintenance reports and follow-up tasks need to be communicated clearly.

OpsRelay provides a centralized interface where employees can submit shift reports and retrieve previously stored operational information using an AI-powered assistant.

## Key Features

- **Shift Reports:** Submit machine details, shift information, reported problems and maintenance updates.
- **AI Memory Assistant:** Ask questions about previous incidents and retrieve relevant information.
- **Memory History:** Search and view information stored in Hindsight.
- **Recurring Issue Analysis:** Explore potential patterns in reported machine problems.
- **Pending Tasks:** Review unresolved or monitored issues.
- **Memory Timeline:** View retrieved operational information and follow-up activity.
- **Dynamic Dashboard:** Display machine information and memory activity retrieved from Hindsight.

## How It Works

1. An employee submits a shift report through the OpsRelay interface.
2. The Flask backend sends the report to Hindsight.
3. Hindsight retains the operational information in its memory bank.
4. Another employee asks a question through the Memory Assistant.
5. OpsRelay retrieves relevant information using Hindsight Recall and Reflect.
6. The employee can understand the previous incident and its follow-up status.

## Example Scenario

**Morning Shift**

An employee reports that Machine A experienced overheating during a demonstration. The maintenance team is notified, and the machine is placed under monitoring.

**Evening Shift**

A different employee asks:

"What happened to Machine A during the Morning shift?"

OpsRelay uses Hindsight to retrieve the earlier information, helping the employee understand the incident without depending entirely on manual shift communication.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| Memory System | Hindsight |
| Frontend Integration | JavaScript Fetch API |
| Templates | Flask / Jinja2 |
| Configuration | Python dotenv |

## Project Structure

```text
OpsRelay/
│
├── backend/
│   ├── app.py
│   ├── reports.py
│   ├── questions.py
│   ├── issues.py
│   ├── hindsight_service.py
│   └── config.py
│
├── frontend/
│   ├── templates/
│   │   ├── base.html
│   │   ├── dashboard.html
│   │   ├── report.html
│   │   ├── assistant.html
│   │   ├── history.html
│   │   ├── recurring.html
│   │   ├── tasks.html
│   │   └── timeline.html
│   │
│   └── static/
│       ├── css/
│       ├── js/
│       └── images/
│
├── .gitignore
├── README.md
└── requirements.txt
```

*Note: The structure above highlights the main project files. Check the repository for the complete structure.*

## Getting Started

### Prerequisites

- Python installed
- GitHub repository cloned to your computer
- Hindsight Cloud account and API credentials

### 1. Clone the repository

```bash
git clone https://github.com/srisivaniv/OpsRelay.git
cd OpsRelay
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your own Hindsight credentials:

```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_api_key
HINDSIGHT_BANK_ID=opsrelay-business
```

**Important:** Replace the placeholder with your own API key. Never publish your actual API key or commit your `.env` file to GitHub.

### 4. Run the application

From the project root, run:

```bash
python -m backend.app
```

### 5. Open the application

Visit:

```text
http://127.0.0.1:5000/dashboard
```

The dashboard should open when the Flask application and its required services are configured correctly.

## Example Questions

Users can ask the Memory Assistant questions such as:

- What happened to Machine A during the Morning shift?
- Find the previous shift report for Machine B.
- Which machine issues are currently being monitored?
- Are there any repeated problems in the stored reports?

The answers depend on the information available in the Hindsight memory bank.

## My Contribution

**Frontend Development – Team Technova**

My primary responsibility in OpsRelay was frontend development and integration.

My contributions included:

- Designing the dashboard and navigation interface.
- Developing the shift report page.
- Building the Memory Assistant interface.
- Creating the memory history and recurring issues pages.
- Developing the pending tasks and timeline interfaces.
- Connecting frontend interactions with Flask API endpoints using JavaScript.
- Displaying information retrieved from Hindsight in the user interface.

## Challenges and Learnings

During development, we worked through challenges involving frontend-backend integration, asynchronous Hindsight requests, memory retrieval and displaying dynamically retrieved information.

This project helped us gain practical experience with:

- Building a multi-page web application.
- Connecting frontend interfaces to backend APIs.
- Working with AI-powered memory systems.
- Integrating external services.
- Debugging and testing a full-stack application.
- Collaborating through GitHub.

## Current Limitations and Future Improvements

OpsRelay is a working prototype. Some dashboard and follow-up information is derived from retrieved memory text, so it should not be treated as a fully structured operational database.

Future improvements include:

- More accurate structured machine and task tracking.
- User authentication and role-based access.
- Improved recurring issue detection.
- Better reporting and analytics.
- Deployment for online demonstrations.
- Stronger data privacy and backup mechanisms.

## Acknowledgements and References

- **Hindsight Documentation:** https://hindsight.vectorize.io/
- **Hindsight GitHub:** https://github.com/vectorize-io/hindsight
- **Hindsight Cloud:** https://ui.hindsight.vectorize.io
- **Project Repository:** https://github.com/srisivaniv/OpsRelay

---

**Built by Team Technova**

*OpsRelay – Remembering what matters, across every shift.*