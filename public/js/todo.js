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
const currentDateStart = new Date();
currentDateStart.setHours(0, 0, 0, 0);

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

const weekDate = new Date();
weekDate.setDate(currentDay + 7);
weekDate.setHours(23, 59, 59, 999);

const monthDate = new Date();
monthDate.setDate(currentDay + 30);
monthDate.setHours(23, 59, 59, 999);

var widgetData = {
  today: [],
  week: [],
  month: [],

  habits: []
};


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
*/

// Widget Functions
function renderWidget(id, offset) {
  const data = widgetData[id];
  widgetIndex[id] += offset;

  let start = widgetIndex[id] * itemsPerPage[id];
  if (start != 0 && start > widgetData[id].length - 1) {
    start -= itemsPerPage[id];
  }

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

//=========================
// MAIN FUNCTION FOR 
// CREATING LIST ITEMS / EDITING LIST ITEMS
//=========================

/**
 * Creates a list item element representing a task event.
 *
 * @param {Object} event - The task event object.
 * @param {string|number} event.id - The unique identifier for the event.
 * @param {string} event.category - The category of the event.
 * @param {number} event.priority - The priority level of the event (0 for low, 1 for normal, 2 for high).
 * @param {boolean} event.complete - The completion status of the event.
 * @param {Date|string} event.startDate - The start date/time of the event.
 * @param {string} event.title - The title of the event.
 * @returns {HTMLLIElement} The list item element that represents the task.
 */

function updateTasks(listId, taskList) {
  listTarget = document.getElementById(listId);
  listTarget.innerHTML = "";

  taskList.forEach((event) => {
    // Create <li>
    const li = document.createElement("li");
    li.dataset.eventId = event.id;
    li.dataset.category = event.category;
    li.dataset.priority = event.priority;
    li.dataset.startDate = event.startDate;
    
    //code for checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = event.complete;
    checkbox.addEventListener("click", () => {
      toggleComplete(event, li, checkbox);
    });
  
    //formattting date to short date
    const formatDate = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const formattedDate = formatDate.format(event.startDate);

    if (event.startDate < currentDateStart) {
      li.className = "late";
    }
    
    let priorityFlag;
    switch (event.priority) {
      case 0: priorityFlag = "💤";
        break;
      case 1: priorityFlag = "";
        break;
      case 2: priorityFlag = "⚠";
        break;
      default: priorityFlag = "";
        break;
    };
  
    //put title and formatted date onto span
    const span = document.createElement("span");
    span.textContent = `${priorityFlag} ${event.title} - ${formattedDate}`;
  
    //code for edit button
    const editButton = document.createElement("button");
    editButton.textContent = "✏";
    editButton.addEventListener("click", () => {
      openEditWindow(event);
    });
  
    /*//code for delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click", async () => {
      if (confirm(`Delete this item? "${event.title}"`)) {
        const success = await deleteEvent(event.id);
        if (success) {
          li.remove();
        } else {
          alert("error deleting event from sql server");
        }
      }
    }); */
  
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    //li.appendChild(deleteButton);

    listTarget.appendChild(li);
  });
}

// Function to render habits in the Habit Tracker widget
/**
 * Creates a list item element representing the given habit.
 *
 * This function builds an <li> element with:
 * - data attributes for habit id, title, and frequency,
 * - a checkbox that toggles the habit's completion status,
 * - a <span> element that displays the habit title and its streak info,
 * - an edit button that opens the habit edit window.
 *
 * @param {Object} habit - The habit data.
 * @param {(number|string)} habit.id - The unique identifier for the habit.
 * @param {string} habit.title - The title of the habit.
 * @param {string} habit.frequency - The frequency of the habit (e.g., "daily", "weekly", "monthly").
 * @param {boolean} habit.complete - Indicates whether the habit is complete.
 * @param {number} habit.daysComplete - The current streak count for completing the habit.
 * @returns {HTMLElement} The <li> element representing the habit.
 */

function updateHabits(habitsArray) {
  habitsList.innerHTML = "";

  habitsArray.forEach((habit) => {
    const li = document.createElement("li");
    li.dataset.habitId = habit.id;
    li.dataset.title = habit.title;
    li.dataset.frequency = habit.frequency;
  
      // Create checkbox element for habit completion tracking.
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.complete;
    checkbox.addEventListener("click", () => {
      habitComplete(habit, li, checkbox);
    });
  
      // Create span element to show habit details based on frequency.
    const span = document.createElement("span");
    switch (habit.frequency.toLowerCase()) {
      case "daily": 
        span.textContent =  `Did you ${habit.title} today? Days streak: ${habit.daysComplete}`;
        break;
      case "weekly":
        span.textContent = `Did you ${habit.title} this week? Days streak: ${habit.daysComplete}`;
        break;
      case "monthly":
        span.textContent = `Did you ${habit.title} this month? Days streak: ${habit.daysComplete}`;
        break;
      default:
        span.textContent = `Did you ${habit.title}? Days streak: ${habit.daysComplete}`;
        break;
    };
    
    // Create edit button to open the habit editing window.
    const editButton = document.createElement("button");
    editButton.textContent = "🖊";
    editButton.addEventListener("click", () => {
      openHabitEdit(habit, li);
    });
  
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);

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

      let todayEvents = events.filter(function(event) {
        parts = event.startDate.split('T')[0];
        parts = parts.split('-');
        var eventDate = new Date(parts[0], parts[1] - 1, parts[2]); 
        return calendarLoopTime.toDateString() === eventDate.toDateString();
      });
      if (todayEvents.length > 0) {
        const taskDiv = document.createElement('div');
        taskDiv.className = "calendar-task";

        var maxPriority = todayEvents.reduce((a,b) => a.priority > b.priority?a:b).priority;
        switch (maxPriority) {
          case 2:
            taskDiv.classList.add("high-priority");
            break;
          case 1:
            taskDiv.classList.add("normal-priority");
            break;
          case 0:
            taskDiv.classList.add("low-priority");
            break;
        }

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
async function initPages() {
  await initTasks();
  await initHabits();

  let pages = ["today", "week", "month", "habits"];
  pages.forEach(page => {
    renderWidget(page, 0);
  });
  
  setLayout();
}

async function initTasks() {
  widgetData["today"] = [];
  widgetData["week"] = [];
  widgetData["month"] = [];
  await getAllTasks().then(events => {
    events.forEach(event => {
      dateStr = event.startDate.split("T")[0];
      parts = dateStr.split('-');
      var dueDate = new Date(parts[0], parts[1] - 1, parts[2]);

      event.startDate = dueDate;
    
      if (dueDate <= currentDate) {
        widgetData["today"].push(event);
      } else if (dueDate <= weekDate) {
        widgetData["week"].push(event);
      } else if (dueDate <= monthDate) {
        widgetData["month"].push(event);
      }
    });
  })
  let pages = ["today", "week", "month"];
  pages.forEach(page => {
    widgetData[page].sort((a, b) => a.priority - b.priority);
    widgetData[page].sort((a, b) => a.dueDate - b.dueDate);
  });
}

async function initHabits() {
  widgetData["habits"] = [];
  await getAllHabits().then(habits => {
    habits.forEach(habit => {
      widgetData["habits"].push(habit);
    });
  });
}

window.addEventListener("load", () => {
  // Load Tasks
  initPages();

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
