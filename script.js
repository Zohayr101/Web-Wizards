// script.js

// Sample data for widgets
const widgetData = {
    today: ["Task 1", "Task 2", "Task 3", "Task 4"],
    week: ["Weekly Task 1", "Weekly Task 2", "Weekly Task 3"],
    month: ["Monthly Task 1", "Monthly Task 2", "Monthly Task 3", "Monthly Task 4", "Monthly Task 5"],
    goals: ["Goal 1", "Goal 2", "Goal 3", "Goal 4", "Goal 5"]
};

const widgetIndex = {
    today: 0,
    week: 0,
    month: 0,
    goals: 0
};

const ITEMS_PER_PAGE = 2;

function renderWidget(id) {
    const widget = document.getElementById(id);
    const data = widgetData[id];
    const start = widgetIndex[id] * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = data.slice(start, end);

    widget.innerHTML = pageData.map(item => `<li><input type="checkbox"> ${item}</li>`).join("");
}

function navigate(id, direction) {
    const totalItems = widgetData[id].length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    widgetIndex[id] += direction;

    // Prevent navigation outside valid pages
    if (widgetIndex[id] < 0) widgetIndex[id] = 0;
    if (widgetIndex[id] >= totalPages) widgetIndex[id] = totalPages - 1;

    renderWidget(id);
}

// Initialize all widgets
Object.keys(widgetData).forEach(id => renderWidget(id));

// Highlight the current day
const highlightCurrentDay = () => {
    const today = new Date();
    const currentDate = today.getDate(); // Get the day (e.g., 17 for Jan 17)
    const cells = document.querySelectorAll(".calendar-cell");

    // Highlight the matching cell
    cells.forEach((cell) => {
        if (parseInt(cell.textContent) === currentDate) {
            cell.classList.add("current-day");
        }
    });
};

highlightCurrentDay();
