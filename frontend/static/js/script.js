
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

function useSuggestion(button) {
    const input = document.getElementById("chatInput");

    if (input) {
        input.value = button.textContent.trim();
        input.focus();
    }
}

const chatForm = document.getElementById("chatForm");

if (chatForm) {
    chatForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const input = document.getElementById("chatInput");
        const messages = document.getElementById("chatMessages");
        const question = input.value.trim();

        if (!question) return;

        const userMessage = document.createElement("div");
        userMessage.className = "message user-message";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = question;

        userMessage.appendChild(content);
        messages.appendChild(userMessage);

        input.value = "";

        messages.scrollTop = messages.scrollHeight;

        const notice = document.createElement("div");
        notice.className = "message assistant-message";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "O";

        const reply = document.createElement("div");
        reply.className = "message-content";
        reply.textContent =
            "The Memory Assistant backend is not connected yet. Once integrated with Hindsight, I will retrieve information from previous shift reports.";

        notice.appendChild(avatar);
        notice.appendChild(reply);

        messages.appendChild(notice);
        messages.scrollTop = messages.scrollHeight;
    });
}

// Machine History Search

function searchMachines() {
    const searchInput = document.getElementById("machineSearch");
    const table = document.getElementById("historyTable");
    const noResults = document.getElementById("noHistoryResults");

    if (!searchInput || !table) return;

    const searchValue = searchInput.value.trim().toLowerCase();
    const rows = table.querySelectorAll("tbody tr");

    let visibleCount = 0;

    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const matches = rowText.includes(searchValue);

        row.style.display = matches ? "" : "none";

        if (matches) visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
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
