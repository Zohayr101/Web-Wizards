// todo.js

//temporary username until database is operational
const username = "username_test";

// DOM Elements
const habitsList = document.getElementById("habits-list"); // For Habit Tracker

const quoteElement = document.getElementById("motivational-quote");

//Calendar
const calendarHeader = document.getElementById("calendar-header");
const calendarGrid = document.getElementById("calendar-grid");

var calendarTime = new Date();
var calendarDisplay = "month";

// Set date constants for today's date info as well as 7 and
// 30 days from now
const currentDate = new Date();
currentDate.setHours(23, 59, 59, 999);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

const weekDate = new Date();
weekDate.setDate(currentDay + 7);
weekDate.setHours(23, 59, 59, 999);

const monthDate = new Date();
monthDate.setDate(currentDay + 30);
monthDate.setHours(23, 59, 59, 999);

//temporary todo tasks until database is operational
var widgetData = {
  today: [
    { name: "Task 1", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 2", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 3", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 4", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
  ],
  week: [
    { name: "Week Task 1", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 2", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 3", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 4", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
  ],
  month: [
    { name: "Month Task 1", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 2", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 3", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 4", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
  ],

  habits: [
    {
      name: "Did you drink water today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
    {
      name: "Did you exercise today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
    {
      name: "Did you do your XYZ today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
  ],
};

var widgetIndex = {
  today: 0,
  week: 0,
  month: 0,
  habits: 0,
};

var itemsPerPage = {
  today: 4,
  week: 4,
  month: 2,
  habits: 2,
};

const layouts = [
  "layout-default",
  "layout-mirrored",
  "layout-large-today",
  "layout-top-tasks",
  "layout-bottom-tasks",
  "layout-week-calendar",
  "layout-no-calendar",
];

const themes = ["light", "green", "purple", "jing", "dark"];

// Task Modal Functions
function addTaskWindow() {
  document.getElementById("add-task").style.display = "block";
}

function closeTaskWindow() {
  document.getElementById("add-task").style.display = "none";
}

function addTask(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  const taskName = document.getElementById("task-name").value;
  const taskDueInput = document.getElementById("task-due-date").value;

  const taskDueDate = new Date(taskDueInput);
  taskDueDate.setDate(taskDueDate.getDate() + 1);

  const newTask = {
    id: taskDueDate.valueOf() + Math.random(),
    name: taskName,
    dueDate: taskDueDate.valueOf(),
    completed: false,
  };

  // Close modal and reset form
  closeTaskWindow();
  document.getElementById("add-task-form").reset();

  var listId;
  if (newTask.dueDate <= currentDate.valueOf()) {
    listId = "today";
  } else if (newTask.dueDate <= weekDate.valueOf()) {
    listId = "week";
  } else if (newTask.dueDate <= monthDate.valueOf()) {
    listId = "month";
  }

  tasks = widgetData[listId];

  // Push into the array
  // Update the lists with the new task
  tasks.push(newTask);
  tasks.sort((a, b) => a.dueDate - b.dueDate);

  // Local storage
  localStorage.setItem(listId, JSON.stringify(tasks));

  renderWidget(listId, 0);
}

// Widget Functions
function renderWidget(id, offset) {
  const data = widgetData[id];
  widgetIndex[id] += offset;

  const start = widgetIndex[id] * itemsPerPage[id];
  const end = start + itemsPerPage[id];
  const pageData = data.slice(start, end);

  const backButton = document.getElementById(id + "-back");
  const forwardButton = document.getElementById(id + "-forward");
  if (start === 0) {
    backButton.disabled = true;
  } else {
    backButton.disabled = false;
  }

  if (end >= data.length) {
    forwardButton.disabled = true;
  } else {
    forwardButton.disabled = false;
  }

  if (id === "habits") {
    updateHabits(pageData);
  } else {
    updateTasks(id + "-list", pageData);
  }
}

function updateTasks(listId, taskList) {
  listTarget = document.getElementById(listId);
  listTarget.innerHTML = "";

  taskList.forEach((task) => {
    // Create <li>
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    const taskDate = new Date(task.dueDate);
    span.textContent = `${task.name} (Due: ${taskDate.toLocaleDateString()})`;

    const li = document.createElement("li");
    li.appendChild(checkbox);
    li.appendChild(span);

    listTarget.appendChild(li);
  });
}

// Function to render habits in the Habit Tracker widget
function updateHabits(habitsArray) {
  habitsList.innerHTML = "";

  habitsArray.forEach((habit) => {
    const span = document.createElement("span");
    span.textContent = habit.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;
    checkbox.addEventListener("change", () => toggleHabit(habit.id));

    if (habit.completed) {
      checkbox.checked = true;
      span.style.textDecoration = "line-through";
      span.style.color = "#777"; // Gray out completed habits
    } else {
      checkbox.checked = false;
    }

    const li = document.createElement("li");
    li.appendChild(checkbox);
    li.appendChild(span);

    habitsList.appendChild(li);
  });
}

// Function to toggle habit completion
function toggleHabit(habitId) {
  habitTarget = widgetData["habits"].find((habit) => habit.id === habitId);
  habitTarget.completed = !habitTarget.completed;

  renderWidget("habits", 0);

  localStorage.setItem("habits", JSON.stringify(widgetData["habits"]));
}

function cycleLayout() {
  const content = document.getElementsByClassName("main-content")[0];
  let currentLayout = content.id;
  let nextLayoutIndex = (layouts.indexOf(currentLayout) + 1) % layouts.length;
  content.id = layouts[nextLayoutIndex];
}

function setLayout(layout) {
  document.getElementsByClassName("main-content")[0].id = layout;
  if (layout === "layout-week-calendar") {
    calendarDisplay = "week";
    initCalendar();
  } else if (calendarDisplay !== "month") {
    calendarDisplay = "month";
    initCalendar();
  }
}

function toggleTheme() {
  const body = document.body;

  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme");
    body.classList.add("green-theme");
    localStorage.setItem("theme", "green");
  } else if (body.classList.contains("green-theme")) {
    body.classList.remove("green-theme");
    body.classList.add("purple-theme");
    localStorage.setItem("theme", "purple");
  } else if (body.classList.contains("purple-theme")) {
    body.classList.remove("purple-theme");
    body.classList.add("jing-theme");
    localStorage.setItem("theme", "jing");
  } else if (body.classList.contains("jing-theme")) {
    body.classList.remove("jing-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  }
}

function setTheme(theme) {
  const body = document.body;
  localStorage.setItem("theme", theme);
  // remove the current theme
  for (let t of themes) {
    body.classList.remove(t + "-theme");
  }
  body.classList.add(theme + "-theme");
}

function initCalendar() {
  if (calendarDisplay === "week") {
    weekday = currentDate.getDay();
    dayDiff = currentDate.getDate() - weekday;

    calendarTime = new Date(currentYear, currentMonth, dayDiff);
  } else if (calendarDisplay === "month") {
    calendarTime = new Date(currentYear, currentMonth, 1);
  }

  setCalendar(0);
}

function setCalendar(offset) {
  if (calendarDisplay === "week") {
    calendarTime.setDate(calendarTime.getDate() + offset * 7);

    year = calendarTime.getFullYear();
    month = calendarTime.getMonth();

    lastDay = 7;
    weekday = 0;
  } else if (calendarDisplay === "month") {
    calendarTime.setMonth(calendarTime.getMonth() + offset);
    
    year = calendarTime.getFullYear();
    month = calendarTime.getMonth();

    lastDay = new Date(year, month + 1, 0).getDate();
    weekday = calendarTime.getDay();
  }

  const monthName = calendarTime.toLocaleString('default', {month: 'long'});
  const dateText = monthName + " " + year;

  loadCalendar(weekday, lastDay, dateText);
}

function loadCalendar(weekday, lastDay, dateText) {
  var calendarDateText = document.createElement('h2');
  calendarDateText.innerText = dateText;

  calendarHeader.innerHTML = "";
  calendarHeader.appendChild(calendarDateText);

  calendarGrid.innerHTML = "";
  calendarLoopTime = new Date(calendarTime);
  for (let day = 0; day < lastDay + weekday; day++) {
    const dayCellDiv = document.createElement('div');

    if (day >= weekday) {
      dayCellDiv.className = 'calendar-cell';

      if (calendarLoopTime.toDateString() === currentDate.toDateString()) {
        dayCellDiv.id = "current-day";
      }

      const dayNumberSpan = document.createElement('span');
      dayNumberSpan.className = "day-number";
      dayNumberSpan.textContent = calendarLoopTime.getDate();
      dayCellDiv.appendChild(dayNumberSpan);

      //example code for adding tasts to day (currently adding task icon
      //to current date)
      if (currentDate.toDateString() === calendarLoopTime.toDateString()) {
        const taskDiv = document.createElement('div');
        taskDiv.className = "calendar-task";

        dayCellDiv.appendChild(taskDiv);
      }

      calendarLoopTime.setDate(calendarLoopTime.getDate() + 1);
    }

    calendarGrid.appendChild(dayCellDiv);
  }
}

// Initialization on Page Load
window.addEventListener("load", () => {
  // Load Tasks
  savedPages = ["today", "week", "month", "habits"];
  savedPages.forEach((page) => {
    const savedTasks = localStorage.getItem(page);
    if (savedTasks) {
      // Parse the JSON string back into an array of tasks
      widgetData[page] = JSON.parse(savedTasks);
    }

    renderWidget(page, 0);
  });

  // Initialize Calendar at current month, year
  initCalendar();

  // Initialize quote cycling on window load
  // Start cycling motivational quotes
  cycleQuotes();

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  } else if (savedTheme === "green") {
    document.body.classList.add("green-theme");
  } else if (savedTheme === "purple") {
    document.body.classList.add("purple-theme");
  } else if (savedTheme === "jing") {
    document.body.classList.add("jing-theme");
  } else {
    document.body.classList.remove(
      "light-theme",
      "green-theme",
      "purple-theme",
      "jing-theme"
    );
  }
});

// 6. Motivational Quotes Functionality

// Array of five-word motivational quotes
const motivationalQuotes = [
  "Believe in yourself always.",
  "Dream big, work hard.",
  "Stay positive, work hard.",
  "Never give up hope.",
  "Embrace the journey ahead.",
  "Choose joy every day.",
  "Create your own sunshine.",
  "Stay strong, stay positive.",
  "Make it happen today.",
  "Be the change now.",
];

// Function to cycle through quotes
function cycleQuotes() {
  let quoteIndex = 0;

  // Function to display the next quote
  const showNextQuote = () => {
    // Remove 'visible' class to start fade-out
    quoteElement.classList.remove("visible");

    // After the fade-out transition ends, update the text and fade in
    setTimeout(() => {
      quoteElement.textContent = motivationalQuotes[quoteIndex];
      quoteElement.classList.add("visible");

      // Update index to the next quote, looping back if necessary
      quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
    }, 1000); // 1000ms matches the CSS transition duration
  };

  // Initially show the first quote
  showNextQuote();

  // Set interval to change quotes every 5 seconds
  setInterval(showNextQuote, 5000);
}
