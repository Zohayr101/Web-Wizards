// script.js

// Data Structures
const tasksToDo = [];
const widgetData = {
    today: ["Task 1", "Task 2", "Task 3", "Task 4"],
    week: ["Weekly Task 1", "Weekly Task 2", "Weekly Task 3"],
    month: ["Monthly Task 1", "Monthly Task 2", "Monthly Task 3", "Monthly Task 4", "Monthly Task 5"],
    habits: [] // Habits will be initialized with predefined entries
};

const widgetIndex = {
    today: 0,
    week: 0,
    month: 0,
    habits: 0
};

const ITEMS_PER_PAGE = 2;

// Habit Tracker Data
const habitData = []; // Array to store habits

// DOM Elements
const todayList = document.getElementById("today-list");
const sevenDayList = document.getElementById("week-list");
const thirtyDayList = document.getElementById("month-list");
const habitsList = document.getElementById("habit-list"); // For Habit Tracker
const calendar = document.getElementById("calendar");
const calendarDate = document.getElementById("calendar-header");

const username = "username_test";

const calendarGrid = document.getElementById("calendar-grid");

// Set date constants for today's date info as well as 7 and
// 30 days from now
const currentTime = new Date();
const currentYear = currentTime.getFullYear();
const currentMonth = currentTime.getMonth() + 1;
const currentDay = currentTime.getDate();

currentTime.setDate(currentTime.getDate() + 7);
const inSevenYear = currentTime.getFullYear();
const inSevenMonth = currentTime.getMonth() + 1;
const inSevenDay = currentTime.getDate();

currentTime.setDate(currentTime.getDate() + 23);
const inThirtyYear = currentTime.getFullYear();
const inThirtyMonth = currentTime.getMonth() + 1;
const inThirtyDay = currentTime.getDate();

var calendarTime = new Date();

// Task Modal Functions
function addTaskWindow() {
  document.getElementById("add-task").style.display = "block";
}

function closeTaskWindow() {
  document.getElementById("add-task").style.display = "none";
}

function addTask(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  const taskName = document.getElementById("taskName").value;
  const taskDueDate = document.getElementById("taskDueDate").value;

  // Push into the array
  tasksToDo.push({ toDoName: taskName, toDoDueDate: taskDueDate });

  // Close modal and reset form
  closeTaskWindow();
  document.getElementById("addTaskForm").reset();

  // Update the lists with the new task
  updateLists();

  // Local storage
  localStorage.setItem("tasksToDo", JSON.stringify(tasksToDo));
}

function loadCalendar(offset) {
  calendarTime.setMonth(calendarTime.getMonth() + offset);
  calendarYear = calendarTime.getFullYear();
  calendarMonth = calendarTime.getMonth();

  lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  weekday = new Date(calendarYear, calendarMonth, 1).getDay();

  monthName = calendarTime.toLocaleString('default', {month: 'long'});
  var calendarDateText = document.createElement('h2');
  calendarDateText.innerText = monthName + " " + calendarYear;
  calendarDate.innerHTML = '';
  calendarDate.appendChild(calendarDateText);

  calendarGrid.innerHTML = '';
  for (let day = 0; day < 38; day++) {
    var dayCellDiv = document.createElement('div');

    if (day >= weekday && day < lastDay + weekday) {
      if (calendarYear === currentYear && calendarMonth + 1 === currentMonth && day - weekday + 1 === currentDay) {
        dayCellDiv.id = "current-day";
      }

      var dayNumberSpan = document.createElement('span');
      dayNumberSpan.className = "day-number";
      dayNumberSpan.textContent = day - weekday + 1;
      dayCellDiv.appendChild(dayNumberSpan);

      dayCellDiv.className = 'calendar-cell';
    }

    calendarGrid.appendChild(dayCellDiv);
  }
}

function dateDiff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function updateLists() {
  // Clear existing lists
  todayList.innerHTML = "";
  sevenDayList.innerHTML = "";
  thirtyDayList.innerHTML = "";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  tasksToDo.forEach(task => {
    if (!task.toDoDueDate) {
      // If no due date, categorize as today
      todayList.appendChild(createTaskElement(task.toDoName));
      return;
    }

    const dueDate = new Date(task.toDoDueDate);
    dueDate.setHours(0, 0, 0, 0);

    // Create <li>
    const li = document.createElement("li");
    li.textContent = `${task.toDoName} (Due: ${task.toDoDueDate})`;

    const diffDays = dateDiff(now, dueDate) + 1;
    // console.log(task.toDoDueDate + " " + diffDays); // Log to see what the diff days is getting

    // Put in list
    if (diffDays === 0) {
      todayList.appendChild(li);
    } else if (diffDays > 0 && diffDays <= 7) {
      sevenDayList.appendChild(li);
    } else if (diffDays > 7 && diffDays <= 30) {
      thirtyDayList.appendChild(li);
    }
  });
}

function createTaskElement(taskName) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  li.prepend(checkbox);
  li.appendChild(document.createTextNode(` ${taskName}`));
  return li;
}

 // Widget Functions
function renderWidget(id) {
  const widget = document.getElementById(id + "-list");
  const data = widgetData[id];
  const start = widgetIndex[id] * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = data.slice(start, end);

  // Check if the widget element exists to prevent errors
  if (widget) {
      widget.innerHTML = pageData.map(item => `<li><input type="checkbox"> ${item}</li>`).join("");
  }
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

// Habit Tracker Functions

// Initialize Habit Tracker with predefined habits
function initializeHabits() {
    const predefinedHabits = [
        { name: "Did you drink water today?", completed: false },
        { name: "Did you exercise today?", completed: false }
    ];

    // Overwrite habitData with predefined habits
    habitData.length = 0; // Clear any existing data
    predefinedHabits.forEach(habit => {
        habitData.push(habit);
    });

    // Save to localStorage
    localStorage.setItem("habits", JSON.stringify(habitData));

    // Render Habits
    renderHabits();
}

// Function to toggle habit completion
function toggleHabit(index) {
    habitData[index].completed = !habitData[index].completed;
    saveHabits();
    renderHabits();
}

// Function to render habits in the Wide Habit Tracker widget
function renderHabits() {
    habitsList.innerHTML = "";
    habitData.forEach((habit, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = habit.completed;
        checkbox.addEventListener("change", () => toggleHabit(index));
        li.appendChild(checkbox);

        const span = document.createElement("span");
        span.textContent = habit.name;
        if (habit.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "#777"; // Gray out completed habits
        }
        li.appendChild(span);

        habitsList.appendChild(li);
    });
}

// Function to save habits to local storage
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habitData));
}

// Function to load habits from local storage
function loadHabits() {
    // Always initialize with predefined habits to prevent arbitrary entries
    initializeHabits();
}

function toggleTheme() {
  const body = document.body;
  
  if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('green-theme');
      localStorage.setItem('theme', 'green');
  } else if (body.classList.contains('green-theme')) {
      body.classList.remove('green-theme');
      body.classList.add('purple-theme');
      localStorage.setItem('theme', 'purple');
  } else if (body.classList.contains('purple-theme')) {
      body.classList.remove('purple-theme');
      body.classList.add('jing-theme');
      localStorage.setItem('theme', 'jing');
  } else if (body.classList.contains('jing-theme')) {
      body.classList.remove('jing-theme');
      localStorage.setItem('theme', 'dark');
  } else {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
  }
}

// Initialization on Page Load
window.addEventListener("load", () => {
    // Load Tasks
    const savedTasks = localStorage.getItem("tasksToDo");
    if (savedTasks) {
      // Parse the JSON string back into an array of tasks
      const parsedTasks = JSON.parse(savedTasks);
      // Spread the parsed tasks into our tasksToDo array
      tasksToDo.push(...parsedTasks);
    }
    // Refresh UI
    updateLists();

    // Initialize Widgets (excluding Goals)
    Object.keys(widgetData).forEach(id => renderWidget(id));

    // Initialize Habit Tracker
    loadHabits();
    loadCalendar(0);

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
        document.body.classList.remove("light-theme", "green-theme", "purple-theme", "jing-theme");
    }
});

// script.js

// ... [Existing JavaScript Code] ...

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
  "Be the change now."
];

// Function to cycle through quotes
function cycleQuotes() {
  const quoteElement = document.getElementById("motivational-quote");
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
