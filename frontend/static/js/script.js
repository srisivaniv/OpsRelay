
// OpsRelay JavaScript

console.log("OpsRelay frontend loaded successfully!");

// Highlight the current navigation link
const currentPath = window.location.pathname;

document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
    }
});

// Memory Assistant chat interface


// Memory Assistant chat interface

function useSuggestion(button) {
    const input = document.getElementById("chatInput");

    if (input) {
        input.value = button.textContent.trim();
        input.focus();
    }
}

const chatForm = document.getElementById("chatForm");

if (chatForm) {
    chatForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const input = document.getElementById("chatInput");
        const messages = document.getElementById("chatMessages");
        const sendButton = chatForm.querySelector('button[type="submit"]');
        const question = input.value.trim();

        if (!question) return;

        function addMessage(text, type) {
            const message = document.createElement("div");
            message.className = `message ${type}`;

            if (type === "assistant-message") {
                const avatar = document.createElement("div");
                avatar.className = "message-avatar";
                avatar.textContent = "O";
                message.appendChild(avatar);
            }

            const content = document.createElement("div");
            content.className = "message-content";
            content.textContent = text;

            message.appendChild(content);
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
        }

        addMessage(question, "user-message");
        input.value = "";
        input.disabled = true;

        if (sendButton) sendButton.disabled = true;

        addMessage("Searching Hindsight memories...", "assistant-message");

        const loadingMessage = messages.lastElementChild;

        try {
            const response = await fetch("/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: question })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.details || result.error || "Memory request failed."
                );
            }

            loadingMessage.querySelector(".message-content").textContent =
                result.answer || "No answer was returned from Hindsight.";

        } catch (error) {
            console.error("Memory Assistant error:", error);

            loadingMessage.querySelector(".message-content").textContent =
                "Unable to retrieve memories: " + error.message;

        } finally {
            input.disabled = false;
            if (sendButton) sendButton.disabled = false;
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }
    });
}

// Machine History Search


 // Machine History - Real Hindsight Memories

async function searchMachines() {
    const searchInput = document.getElementById("machineSearch");
    const resultsBody = document.getElementById("historyResults");
    const noResults = document.getElementById("noHistoryResults");
    const message = document.getElementById("historyMessage");

    if (!searchInput || !resultsBody) return;

    const searchValue = searchInput.value.trim();

    if (!searchValue) {
        message.textContent = "Please enter a machine name or issue.";
        return;
    }

    resultsBody.innerHTML = "";
    noResults.style.display = "none";
    message.textContent = "Searching Hindsight memories...";

    try {
        const response = await fetch("/api/recall", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: "Find stored shift reports and memories related to " + searchValue
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.details || result.error || "Memory retrieval failed."
            );
        }

        const memories = result.memories || [];

        if (memories.length === 0) {
            noResults.style.display = "block";
            message.textContent = "No matching memories found.";
            return;
        }

        memories.forEach(memory => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.textContent = typeof memory === "string"
                ? memory
                : JSON.stringify(memory);

            row.appendChild(cell);
            resultsBody.appendChild(row);
        });

        message.textContent =
            memories.length + " memory record(s) retrieved from Hindsight.";

    } catch (error) {
        console.error("History retrieval error:", error);

        message.textContent =
            "Unable to retrieve memories: " + error.message;
    }
}


/* Pending Tasks Search and Filter */

function filterTasks() {
    const searchInput = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("taskStatus");
    const table = document.getElementById("taskTable");
    const noResults = document.getElementById("noTaskResults");

    if (!searchInput || !statusFilter || !table || !noResults) return;

    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value.toLowerCase();

    const rows = table.querySelectorAll("tbody tr");
    let visibleCount = 0;

    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const statusText = row.cells[4].textContent.toLowerCase().trim();

        const matchesSearch = rowText.includes(searchValue);
        const matchesStatus =
            selectedStatus === "all" ||
            statusText === selectedStatus;

        const shouldShow = matchesSearch && matchesStatus;

        row.style.display = shouldShow ? "" : "none";

        if (shouldShow) {
            visibleCount++;
        }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
}

// Submit Shift Report to OpsRelay Backend

const shiftReportForm = document.getElementById("shiftReportForm");

if (shiftReportForm) {
    shiftReportForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const message = document.getElementById("reportMessage");
        const submitButton = shiftReportForm.querySelector(
            'button[type="submit"]'
        );

        const reportData = {
            employee: document.getElementById("employee").value.trim(),
            shift: document.getElementById("shift").value,
            machine: document.getElementById("machine").value.trim(),
            issue: document.getElementById("issue").value.trim(),
            action_taken: document.getElementById("action").value.trim(),
            status: document.getElementById("status").value,
            notes: document.getElementById("notes").value.trim()
        };

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
            message.textContent = "Sending report to backend...";
            message.style.color = "#555";

            const response = await fetch("/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reportData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.details || result.error || "Report submission failed."
                );
            }

            message.textContent =
                "Success! Your shift report was stored in Hindsight.";
            message.style.color = "green";

            shiftReportForm.reset();

            console.log("Submitted report:", result.report);

        } catch (error) {
            console.error("Report submission error:", error);

            message.textContent =
                "Submission failed: " + error.message;
            message.style.color = "red";

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Shift Report";
        }
    });
}

// Hindsight Recurring Issues Analysis

async function findIssuePatterns() {
    const machineInput = document.getElementById("patternMachine");
    const message = document.getElementById("patternMessage");
    const result = document.getElementById("patternResult");
    const title = document.getElementById("patternTitle");
    const status = document.getElementById("patternStatus");

    if (!machineInput || !message || !result) return;

    const machine = machineInput.value.trim();

    if (!machine) {
        message.textContent = "Please enter a machine name.";
        return;
    }

    message.textContent = "Analyzing stored Hindsight memories...";
    result.textContent = "Please wait...";
    title.textContent = machine;
    status.textContent = "Analyzing";

    try {
        const response = await fetch(
            "/api/issues/patterns?machine=" + encodeURIComponent(machine)
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || "Analysis failed.");
        }

        result.textContent = data.patterns || "No patterns returned.";

        message.textContent = "Analysis completed successfully using Hindsight.";
        status.textContent = "Analysis complete";

    } catch (error) {
        console.error("Pattern analysis error:", error);

        message.textContent = "Unable to analyze patterns: " + error.message;
        result.textContent = "Please try again.";
        status.textContent = "Unavailable";
    }
}

// Hindsight Pending Tasks

let hindsightTaskMemories = [];

async function loadHindsightTasks() {
    const results = document.getElementById("taskResults");
    const message = document.getElementById("taskMessage");

    if (!results || !message) return;

    try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || "Unable to load records.");
        }

        hindsightTaskMemories = data.tasks || [];

        results.innerHTML = "";

        hindsightTaskMemories.forEach(memory => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.textContent = memory;
            row.appendChild(cell);
            results.appendChild(row);
        });

        message.textContent =
            hindsightTaskMemories.length +
            " memory records retrieved from Hindsight.";

        filterTasks();

    } catch (error) {
        console.error("Pending Tasks error:", error);
        message.textContent = "Unable to retrieve records: " + error.message;
    }
}

function filterTasks() {
    const searchInput = document.getElementById("taskSearch");
    const results = document.getElementById("taskResults");
    const noResults = document.getElementById("noTaskResults");

    if (!searchInput || !results || !noResults) return;

    const searchValue = searchInput.value.trim().toLowerCase();
    const rows = results.querySelectorAll("tr");

    let visibleCount = 0;

    rows.forEach(row => {
        const matches = row.textContent.toLowerCase().includes(searchValue);

        row.style.display = matches ? "" : "none";

        if (matches) visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", loadHindsightTasks);

// Hindsight Memory Timeline

async function loadMemoryTimeline() {
    const timeline = document.getElementById("timelineResults");
    const message = document.getElementById("timelineMessage");

    if (!timeline || !message) return;

    try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || "Unable to load memories.");
        }

        const memories = data.tasks || [];

        timeline.innerHTML = "";

        const machines = new Set();
        let followups = 0;

        memories.forEach((memory, index) => {
            const machineMatches = memory.match(/Machine[A-Za-z0-9]+/gi);

            if (machineMatches) {
                machineMatches.forEach(machine => machines.add(machine.toLowerCase()));
            }

            if (/monitor|maintenance|follow-up|pending/i.test(memory)) {
                followups++;
            }

            const item = document.createElement("div");
            item.className = "timeline-item";

            const marker = document.createElement("div");
            marker.className = "timeline-marker";

            const event = document.createElement("div");
            event.className = "timeline-event";

            const top = document.createElement("div");
            top.className = "timeline-event-top";

            const date = document.createElement("span");
            date.className = "timeline-date";
            date.textContent = "Hindsight Memory Record " + (index + 1);

            const status = document.createElement("span");
            status.className = "status status-progress";
            status.textContent = "Retrieved";

            top.appendChild(date);
            top.appendChild(status);

            const description = document.createElement("p");
            description.textContent = memory;

            event.appendChild(top);
            event.appendChild(description);

            item.appendChild(marker);
            item.appendChild(event);

            timeline.appendChild(item);
        });

        document.getElementById("timelineRecords").textContent = memories.length;
        document.getElementById("timelineMachines").textContent = machines.size;
        document.getElementById("timelineFollowups").textContent = followups;

        message.textContent = memories.length
            + " memory records successfully retrieved from Hindsight.";

        if (memories.length === 0) {
            timeline.textContent = "No memory records found.";
        }

    } catch (error) {
        console.error("Timeline error:", error);
        message.textContent = "Unable to retrieve Hindsight memories: " + error.message;
        timeline.textContent = "Memory timeline could not be loaded.";
    }
}

document.addEventListener("DOMContentLoaded", loadMemoryTimeline);

// Dynamic OpsRelay Dashboard

async function loadDashboardActivity() {
    const table = document.getElementById("dashboardActivity");
    const count = document.getElementById("dashboardMachineCount");
    const message = document.getElementById("dashboardActivityMessage");

    if (!table || !count || !message) return;

    try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || "Unable to load memories.");
        }

        const memories = data.tasks || [];
        const machineRecords = new Map();

        memories.forEach(memory => {
            const matches = memory.match(/Machine\s*[A-Za-z0-9]+/gi);
            if (!matches) return;

            matches.forEach(machine => {
                const machineName = machine.replace(/\s+/g, "");

                if (!machineRecords.has(machineName)) {
                    machineRecords.set(machineName, {
                        issue: "",
                        employee: "",
                        status: "Recorded",
                        memories: []
                    });
                }

                const record = machineRecords.get(machineName);
                record.memories.push(memory);

                // Identify the issue from the stored memory.
                const issueMatch = memory.match(
                    /(?:experienced|detected)\s+(.+?)(?:\s+on\s+Machine\s*[A-Za-z0-9]+|\s+on\s+\d{4}|\.|$)/i
                );

                if (issueMatch && !record.issue) {
                    record.issue = issueMatch[1].trim();
                }

                // Identify the employee when available.
                const employeeMatch = memory.match(/Involving:\s*([^|]+)/i);

                if (employeeMatch && !record.employee) {
                    record.employee = employeeMatch[1]
                        .replace(/\s*\(employee\)/i, "")
                        .trim();
                }

                // Check monitoring status.
                if (/monitoring/i.test(memory)) {
                    record.status = "Monitoring";
                }
            });
        });

        // Fill in employee names from other related memories.
        machineRecords.forEach(record => {
            if (!record.employee) {
                for (const memory of record.memories) {
                    const match = memory.match(
                        /^([A-Za-z][A-Za-z0-9_-]*)\s+(?:reported|detected|is monitoring)\b/i
                    );

                    if (match) {
                        record.employee = match[1];
                        break;
                    }
                }
            }
        });

        table.innerHTML = "";

        machineRecords.forEach((record, machine) => {
            const row = document.createElement("tr");

            const values = [
                machine,
                record.issue || "See stored Hindsight memories",
                record.employee || "Not specified",
                record.status
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        count.textContent = machineRecords.size;

        message.textContent = machineRecords.size
            + " unique machines found in Hindsight memories.";

        if (machineRecords.size === 0) {
            table.innerHTML =
                '<tr><td colspan="4">No machine records found.</td></tr>';
        }

    } catch (error) {
        console.error("Dashboard error:", error);

        count.textContent = "--";
        message.textContent = "Unable to retrieve Hindsight records.";
        table.innerHTML =
            '<tr><td colspan="4">Could not load machine records.</td></tr>';
    }
}

document.addEventListener("DOMContentLoaded", loadDashboardActivity);
