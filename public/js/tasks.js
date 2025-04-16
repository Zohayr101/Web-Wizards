// tasks.js

//=========================
// CONSTANTS
//=========================


//=========================
// GET TASKS
//=========================
async function getAllTasks() {
  try {
    const response = await fetch("/api.events");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    var events = await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }

  return events;
}

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

  closeTaskWindow();
  document.getElementById("task-name").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("add-task-priority").value = 1; // or whatever default

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("error: api post error");
    }

  } catch (error) {
    console.error("API error: ", error);
    return;
  }

  parts = taskData.startDate.split('-');
  var newDate = new Date(parts[0], parts[1] - 1, parts[2]);

  let listId;
  if (newDate <= currentDate) {
    listId = "today";
  } else if (newDate <= weekDate) {
    listId = "week";
  } else if (newDate <= monthDate) {
    listId = "month";
  } else {
    return;
  }

  tasks = widgetData[listId];
  // Push into the array
  // Update the lists with the new task
  taskData.startDate = newDate;
  tasks.push(taskData);
  tasks.sort((a, b) => a.startDate - b.startDate);

  renderWidget(listId, 0);
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
function openEditWindow(event) {
  const editTaskWindow = document.getElementById("edit-task");
  editTaskWindow.style.display = "block";
  console.log(event);
  editTaskWindow.dataset.eventId = event.id;
  editTaskWindow.dataset.title = event.title;
  editTaskWindow.dataset.startDate = event.startDate;
  
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

  let eventDate = document.getElementById("edit-task").dataset.startDate;

  if (confirm(`Delete this item? "${eventTitle}"`)) {
    closeEditWindow();

    const success = await deleteEvent(eventId);
    if (success) {
      if(li) {
        li.remove();

        eventDate = new Date(eventDate);
        if (eventDate <= currentDate) {
          taskId = "today";
        } else if (eventDate <= weekDate) {
          taskId = "week";
        } else if (eventDate <= monthDate) {
          taskId = "month";
        } else {
          return;
        }

        removeIndx = widgetData[taskId].findIndex(task => task.id == eventId);
        if (removeIndx > -1) {
          widgetData[taskId].splice(removeIndx, 1);
        }
        
        renderWidget(taskId, 0);
      }
      
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
