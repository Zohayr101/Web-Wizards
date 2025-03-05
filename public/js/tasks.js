// tasks.js

//=========================
// CONSTANTS
//=========================

const todayDate = new Date();
todayDate.setHours(23, 59, 59, 999);
const today = todayDate.getDate();

const weekDate = new Date();
weekDate.setDate(today + 7);
weekDate.setHours(23, 59, 59, 999);

const monthDate = new Date();
monthDate.setDate(today + 30);
monthDate.setHours(23, 59, 59, 999);


//=========================
// MAIN FUNCTION FOR 
// CREATING LIST ITEMS
//=========================

function createTaskListItem(event) {
  
  const li = document.createElement("li");
  li.dataset.eventId = event.id;

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
  const formattedDate = formatDate.format(new Date(event.startDate));

  //put title and formatted date onto span
  const span = document.createElement("span");
  span.textContent = `${event.title} - ${formattedDate}`;

  //code for edit button
  const editButton = document.createElement("button");
  editButton.textContent = "✏";
  editButton.addEventListener("click", () => {
    openEditWindow(event, li);
  });

  //code for delete button
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
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;
}


//=========================
// GET TASKS
//=========================

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

function addTaskWindow() {document.getElementById("add-task").style.display = "block";}
function closeTaskWindow() {document.getElementById("add-task").style.display = "none";}

document.getElementById("addTaskButton").addEventListener("click", async function (event) {
  
  event.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const dueDate = document.getElementById("task-due-date").value;

  const taskData = {
    title: taskName,
    startDate: dueDate,
    complete: false
  };

  try {
    const response = await fetch("api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });

    if(!response.ok) {
      throw new Error("error: api post error");
    }

    //const newTask = await response.json();
    const todayTaskList = document.getElementById("today-list");
    const li = createTaskListItem(taskData);
    const newDate = new Date(taskData.startDate);

    if (newDate.getTime() <= todayDate.getTime()) {
      todayTaskList.appendChild(li);
    } else if (newDate.getTime() <= weekDate.getTime()) {
      weekTaskList.appendChild(li);
    } else if (newDate.getTime() <= monthDate.getTime()) {
      monthTaskList.appendChild(li);
    }

    console.log("Created task", taskData);

  } catch (error) {
      console.error("API error:", error)
  }

  closeTaskWindow();

});


//=========================
// MODIFY TASK
//=========================

function openEditWindow(event, li) {
  const editTaskWindow = document.getElementById("edit-task");
  editTaskWindow.style.display = "block";
  editTaskWindow.dataset.eventId = event.id;
  
  if(event.complete === true || event.complete) {
    editTaskWindow.dataset.complete = 1;
  } else {
    editTaskWindow.dataset.complete = 0;
  };

  const editTaskName = document.getElementById("edit-task-name");
  const editTaskDueDate = document.getElementById("edit-task-due-date");

  editTaskName.value = event.title;
  editTaskDueDate.value = new Date(event.startDate).toISOString().split("T")[0];

}

function closeEditWindow() {document.getElementById("edit-task").style.display = "none";}

//function for checking task as complete/incomplete
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
}

//function for the edit window button
document.getElementById("editTaskButton").addEventListener("click", async function (event) {
  event.preventDefault();

  const updateTitle = document.getElementById("edit-task-name").value;
  const updateDueDate = document.getElementById("edit-task-due-date").value;
  const complete = document.getElementById("edit-task").dataset.complete;
  const eventId = document.getElementById("edit-task").dataset.eventId;

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: updateTitle,
        startDate: updateDueDate,
        complete: complete
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    const li = document.querySelector(`li[data-event-id="${eventId}"]`)
    if (li) {
      const span = li.querySelector('span');
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
