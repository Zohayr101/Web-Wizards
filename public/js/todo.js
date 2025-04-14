// todo.js

//temporary username until database is operational
//const username = "username_test";

// DOM Elements
/**
 * Element for the Habit Tracker's list.
 * @type {HTMLElement}
 */
const habitsList = document.getElementById("habits-list"); // For Habit Tracker

/**
 * Element to display a motivational quote.
 * @type {HTMLElement}
 */
const quoteElement = document.getElementById("motivational-quote");

//Calendar
/**
 * Calendar header element.
 * @type {HTMLElement}
 */
const calendarHeader = document.getElementById("calendar-header");

/**
 * Calendar grid element.
 * @type {HTMLElement}
 */
const calendarGrid = document.getElementById("calendar-grid");

/**
 * Current calendar time reference.
 * @type {Date}
 */
var calendarTime = new Date();
var calendarDisplay = "month";

// Set date constants for today's date info as well as 7 and
// 30 days from now
/**
 * Today's date with time set to 23:59:59.999.
 * @type {Date}
 */
const currentDate = new Date();
currentDate.setHours(23, 59, 59, 999);

/**
 * The current year.
 * @type {number}
 */
const currentYear = currentDate.getFullYear();

/**
 * The current month (0-based index).
 * @type {number}
 */
const currentMonth = currentDate.getMonth();

/**
 * The current day of the month.
 * @type {number}
 */
const currentDay = currentDate.getDate();

//const weekDate = new Date();
//weekDate.setDate(currentDay + 7);
//weekDate.setHours(23, 59, 59, 999);

//const monthDate = new Date();
//monthDate.setDate(currentDay + 30);
//monthDate.setHours(23, 59, 59, 999);

//temporary todo tasks until database is operational
/*
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
*/

/**
 * Tracks the current index for widget pagination.
 * @type {{today: number, week: number, month: number, habits: number}}
 */
var widgetIndex = {
  today: 0,
  week: 0,
  month: 0,
  habits: 0,
};

/**
 * Items per page for widget pagination.
 * @type {{today: number, week: number, month: number, habits: number}}
 */
var itemsPerPage = {
  today: 4,
  week: 4,
  month: 2,
  habits: 2,
};

layouts = window.LAYOUTS;
themes = window.THEMES;

/*
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
*/

/**
 * Sets the layout for the calendar based on the saved layout in local storage.
 *
 * If the layout is "layout-week-calendar", the calendar display mode is set to week,
 * otherwise it is set to month. The calendar is then initialized.
 */
function setLayout() {
  layout = localStorage.getItem("layout");
  if (layout === "layout-week-calendar") {
    calendarDisplay = "week";
    initCalendar();
  } else {
    calendarDisplay = "month";
    initCalendar();
  }
}

/**
 * Initializes the calendar based on the current display mode.
 *
 * For "week" display, the calendar is set to start on the first day of the current week.
 * For "month" display, the calendar is set to the first day of the current month.
 * After setting the date reference, it calls setCalendar to render the view.
 */
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

/**
 * Updates the calendar based on the current display mode and a provided offset.
 *
 * For a week display, the calendar is offset by multiples of 7 days.
 * For a month display, the calendar is offset by full months.
 *
 * @param {number} offset - The offset value (weeks if in week mode, months if in month mode).
 */
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

/**
 * Renders the calendar header and grid based on parameters.
 *
 * @param {number} weekday - The day of the week that the first day of the calendar falls on.
 * @param {number} lastDay - The number of days in the calendar period.
 * @param {string} dateText - The formatted date text for the calendar header.
 */
async function loadCalendar(weekday, lastDay, dateText) {
  var calendarDateText = document.createElement('h2');
  calendarDateText.innerText = dateText;

  calendarHeader.innerHTML = "";
  calendarHeader.appendChild(calendarDateText);

  try {
    const response = await fetch("/api.events");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    var events = await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }

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
      var todayEvents = events.filter(function(event) {
        eventDate = new Date(event.startDate);
        eventDate.setDate(eventDate.getDate() + 1);
        return calendarLoopTime.toDateString() === eventDate.toDateString();
      });
      if (todayEvents.length > 0) {
        console.log(todayEvents[0].startDate)
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
/**
 * Handles the initial setup when the window loads.
 *
 * - Sets the layout and initializes the calendar.
 * - Loads motivational quotes, applies the saved theme, layout, and font.
 * - (Commented code is present to load and render tasks from local storage.)
 */
window.addEventListener("load", () => {
  // Load Tasks
  /*savedPages = ["today", "week", "month", "habits"];
  savedPages.forEach((page) => {
    const savedTasks = localStorage.getItem(page);
    if (savedTasks) {
      // Parse the JSON string back into an array of tasks
      widgetData[page] = JSON.parse(savedTasks);
    }

    renderWidget(page, 0);
  });*/

  setLayout();

  // Initialize quote cycling on window load
  // Start cycling motivational quotes
  
  let checkedQuotes = localStorage.getItem('checkedQuotes').split(',');
  for (let option of checkedQuotes) {
    quotes = quotes.concat(window[option]);
  }

  shuffleArray(quotes);
  cycleQuotes();

  // Apply saved theme
  document.body.classList.add(localStorage.getItem("theme"));
  // Apply saved layout
  document.body.getElementsByClassName("main-content")[0].id = localStorage.getItem("layout");
  // Apply saved font
  document.body.style.fontFamily = localStorage.getItem("font");
});

// 6. Motivational Quotes Functionality
/**
 * Array to store motivational quotes.
 * @type {Array<string>}
 */
let quotes = [];

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * @param {Array<any>} array - The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to cycle through quotes
/**
 * Cycles through motivational quotes and updates the display element with a fade effect.
 *
 * The function initially displays the first quote, and then every 5 seconds it changes
 * the quote with a fade-out and fade-in transition.
 */
function cycleQuotes() {
  const quoteElement = document.getElementById("motivational-quote");
  let quoteIndex = 0;
  
    // Function to display the next quote
      /**
   * Displays the next quote with a fade transition.
   */
  const showNextQuote = () => {
    // Remove 'visible' class to start fade-out
    quoteElement.classList.remove("visible");

    // After the fade-out transition ends, update the text and fade in
    setTimeout(() => {
      quoteElement.textContent = quotes[quoteIndex];
      quoteElement.classList.add("visible");

      // Update index to the next quote, looping back if necessary
      quoteIndex = (quoteIndex + 1) % quotes.length;
    }, 1000); // 1000ms matches the CSS transition duration
  };

  // Initially show the first quote
  showNextQuote();

  // Set interval to change quotes every 5 seconds
  setInterval(showNextQuote, 5000);
}
