// tasks.js

//=========================
// CONSTANTS
//=========================

/**
 * The end of today's date set to 23:59:59:999.
 * @type {Date}
 */
const todayDate = new Date();
todayDate.setHours(23, 59, 59, 999);

/**
 * The numeric day for today.
 * @type {number}
 */
const today = todayDate.getDate();

/**
 * The date object representing one week from today, with time set to 23:59:59:999.
 * @type {Date}
 */
const weekDate = new Date();
weekDate.setDate(today + 7);
weekDate.setHours(23, 59, 59, 999);

/**
 * The date object representing approximately one month (30 days) from today, with time set to 23:59:59:999.
 * @type {Date}
 */
const monthDate = new Date();
monthDate.setDate(today + 30);
monthDate.setHours(23, 59, 59, 999);


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
function createTaskListItem(event) {
  
  const li = document.createElement("li");
  li.dataset.eventId = event.id;
  li.dataset.category = event.category;
  li.dataset.priority = event.priority;

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
  const rawDate = new Date(event.startDate);
  rawDate.setDate(rawDate.getDate() + 1);
  const formattedDate = formatDate.format(rawDate);

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
    openEditWindow(event, li);
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

  return li;
}


//=========================
// GET TASKS
//=========================

/**
 * Fetches task events from the server when the DOM is fully loaded, creates corresponding list items,
 * and appends them to their respective lists based on due dates.
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api.events");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const events = await response.json();
    const todayTaskList = document.getElementById("today-list");
    const weekTaskList = document.getElementById("week-list");
    const monthTaskList = document.getElementById("month-list");

    events.forEach(event => {
      const li = createTaskListItem(event);
      const dueDate = new Date(event.startDate);

      if (dueDate.getTime() <= todayDate.getTime()) {
        todayTaskList.appendChild(li);
      } else if (dueDate.getTime() <= weekDate.getTime()) {
        weekTaskList.appendChild(li);
      } else if (dueDate.getTime() <= monthDate.getTime()) {
        monthTaskList.appendChild(li);
      }
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
});


//=========================
// ADD TASK
//=========================

/**
 * Opens the "add task" window by making the corresponding HTML element visible.
 */
function addTaskWindow() {document.getElementById("add-task").style.display = "block";}

/**
 * Closes the "add task" window by hiding the corresponding HTML element.
 */
function closeTaskWindow() {document.getElementById("add-task").style.display = "none";}

// Handle "Add Task" button click event to create a new task
document.getElementById("addTaskButton").addEventListener("click", async function (event) {
  event.preventDefault();
  
  const taskName = document.getElementById("task-name").value;
  const dueDate = document.getElementById("task-due-date").value;
  const taskCategory = document.getElementById("task-category").value;
  const taskPriority = parseInt(document.getElementById("add-task-priority").value, 10);

  const taskData = {
    title: taskName,
    startDate: dueDate,
    complete: false,
    category: taskCategory,
    priority: taskPriority
  };

  console.log(taskData);

  closeTaskWindow();
  document.getElementById("task-name").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("add-task-priority").value = 1; // or whatever default

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });

    if(!response.ok) {
      throw new Error("error: api post error");
    }

    var newTask = await response.json();
  } catch (error) {
      console.error("API error:", error);
  }
  
  const todayTaskList = document.getElementById("today-list");
  const weekTaskList = document.getElementById("week-list");
  const monthTaskList = document.getElementById("month-list");

  const li = createTaskListItem(newTask);

  const newDate = new Date(taskData.startDate);
  newDate.setDate(newDate.getDate() + 1);

  if (newDate.getTime() <= todayDate.getTime()) {
    todayTaskList.appendChild(li);
  } else if (newDate.getTime() <= weekDate.getTime()) {
    weekTaskList.appendChild(li);
  } else if (newDate.getTime() <= monthDate.getTime()) {
    monthTaskList.appendChild(li);
  }

  setLayout();
});

//=========================
// MODIFY TASK
//=========================

/**
 * Opens the edit task window and populates it with the selected task's details.
 *
 * @param {Object} event - The task event object.
 * @param {HTMLElement} li - The list item element representing the task.
 */
function openEditWindow(event, li) {
  const editTaskWindow = document.getElementById("edit-task");
  editTaskWindow.style.display = "block";
  editTaskWindow.dataset.eventId = event.id;
  editTaskWindow.dataset.title = event.title;
  
  //new fields
  editTaskWindow.dataset.category = event.category;
  editTaskWindow.dataset.priority = event.priority;
  
  if(event.complete === true || event.complete) {
    editTaskWindow.dataset.complete = 1;
  } else {
    editTaskWindow.dataset.complete = 0;
  };

  const editTaskName = document.getElementById("edit-task-name");
  const editTaskDueDate = document.getElementById("edit-task-due-date");
  const editTaskCategory = document.getElementById("edit-task-category");
  const editTaskPriority = document.getElementById("edit-task-priority");

  editTaskName.value = event.title;
  editTaskDueDate.value = new Date(event.startDate).toISOString().split("T")[0];
  editTaskCategory.value = event.category;
  editTaskPriority.value = event.priority;

}

/**
 * Closes the edit task window by hiding the corresponding HTML element.
 */
function closeEditWindow() {document.getElementById("edit-task").style.display = "none";}

//function for checking task as complete/incomplete
/**
 * Toggles the completion status of a task and updates it on the server.
 *
 * @param {Object} event - The task event object.
 * @param {HTMLElement} li - The list item element representing the task.
 * @param {HTMLInputElement} checkbox - The checkbox element that triggered the action.
 */
async function toggleComplete(event, li, checkbox) {
  const updateComplete = !event.complete;
  const eventId = event.id;
  const eventTitle = event.title;
  const dueDate = event.startDate;

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        complete: updateComplete,
        title: eventTitle,
        startDate: dueDate
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    event.complete = updateComplete;
    checkbox.checked = updateComplete;
  
  } catch(error) {
    console.error("error updating task complete: ", error);
    checkbox.checked = event.complete;
  }

  if (updateComplete) {
    incrementTaskComplete();
  }
}

async function incrementTaskComplete() {
  let response = await fetch("/api.stats");
  stats = await response.json();
  if (stats.length === 0) {
    // No stats found, initialize them
    console.log("No stats found. Initializing...");
    const initResponse = await fetch("/api/stats/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (initResponse.ok) {
        stats = await initResponse.json();
        console.log("Stats initialized:", stats);
    } else {
        console.error("Failed to initialize stats:", initResponse.statusText);
        return;
    }
} else {
    stats = stats[0]; // Assuming stats is an array, take the first entry
}
let id = await stats.id;

stats.tasksCompleted++; // KEY DIFFERENCE

const updateResponse = await fetch(`/api/stats/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(stats)
});
if (!updateResponse.ok) {
    console.error(updateResponse.statusText);
}
}

//function for the edit window button
/**
 * Handles the click event for updating an existing task.
 *
 * This asynchronous function is triggered when the edit task button is clicked.
 * It prevents the default form submission behavior, retrieves updated task values
 * from the edit form, and sends a PUT request to update the event on the server.
 * If the response is successful, it updates the corresponding list item in the DOM
 * with the new title and formatted due date, and then closes the edit window.
 *
 * @param {Event} event - The click event triggered by the edit task button.
 */
document.getElementById("editTaskButton").addEventListener("click", async function (event) {
  event.preventDefault();

  const updateTitle = document.getElementById("edit-task-name").value;
  const updateDueDate = document.getElementById("edit-task-due-date").value;
  const complete = document.getElementById("edit-task").dataset.complete;
  const eventId = document.getElementById("edit-task").dataset.eventId;
  const category = document.getElementById("edit-task-category").value;
  const priority = parseInt(document.getElementById("edit-task-priority").value, 10);

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: updateTitle,
        startDate: updateDueDate,
        complete: complete,
        category: category,
        priority: priority
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    const li = document.querySelector(`li[data-event-id="${eventId}"]`)
    if (li) {
      const span = li.querySelector("span");
      const formatDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
      const formattedDate = formatDate.format(new Date(updateDueDate));
      span.textContent = `${updateTitle} - ${formattedDate}`
    }

    closeEditWindow();
  } catch (error) {
    console.error("Error updating event: ", error);
  }
});


//=========================
// DELETE TASK
//=========================

/**
 * Deletes the selected task after confirming with the user, updates the UI accordingly,
 * and closes the edit window.
 */
const deleteButton = document.getElementById("deleteTaskButton");
  //deleteButton.textContent = "🗑";
deleteButton.addEventListener("click", async () => {
  const eventId = document.getElementById("edit-task").dataset.eventId;
  const eventTitle = document.getElementById("edit-task").dataset.title;
  const li = document.querySelector(`li[data-event-id="${eventId}"]`);


    if (confirm(`Delete this item? "${eventTitle}"`)) {
      const success = await deleteEvent(eventId);
      if (success) {
        if(li) {
          li.remove();

        }
        closeEditWindow();
        
      } else {
        alert("error deleting event from sql server");
      }
    }
});

/**
 * Deletes a task event from the server.
 *
 * @param {string|number} eventId - The ID of the task event to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the event was deleted successfully, or false otherwise.
 */
async function deleteEvent(eventId) {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return true;
  } catch (error) {
    console.error("delete failed:", error);
    return false;
  }
}
