// habits.js

//=========================
// MAIN FUNCTION FOR
// CREATING LIST ITEMS
//=========================


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
function createHabitListItem(habit) {
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

  return li;
}


//=========================
// GET HABITS
//=========================
/**
 * Initializes the habits list when the DOM content is loaded.
 *
 * Fetches habit data from the API endpoint "/api.habits" and appends each habit as a list item
 * into the element with the id "habits-list".
 *
 * @async
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api.habits");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const habits = await response.json();
    const habitsList = document.getElementById("habits-list");

    habits.forEach((habit) => {
      const li = createHabitListItem(habit);
      habitsList.appendChild(li);
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
});


//=========================
// ADD HABIT
//=========================

/**
 * Displays the "add habit" window.
 *
 * Sets the display style of the element with id "add-habit" to "block".
 */
function addHabitWindow() {
  document.getElementById("add-habit").style.display = "block";
}

/**
 * Hides the "add habit" window.
 *
 * Sets the display style of the element with id "add-habit" to "none".
 */
function closeHabitWindow() {
  document.getElementById("add-habit").style.display = "none";
}

/**
 * Handles the "add habit" form submission.
 *
 * Gathers habit name and frequency from the input fields, sends a POST request
 * to create a new habit on the server, appends the new habit to the habits list, and closes the form.
 *
 * @async
 * @event click on #add-habit-button
 * @param {Event} event - The click event.
 */
document
  .getElementById("add-habit-button")
  .addEventListener("click", async function(event) {
    event.preventDefault();

    const habitName = document.getElementById("habit-name").value;
    const habitFrequency = document.getElementById("habit-frequency").value;

    const habitData = {
      title: habitName,
      frequency: habitFrequency,
      complete: false,
      habitStreak: 0
    };

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habitData),
      });

      if (!response.ok) {
        throw new Error("error: api post error");
      }

      const newHabit = await response.json();
      const habitsList = document.getElementById("habits-list");
      const li = createHabitListItem(newHabit);

      habitsList.appendChild(li);
      console.log("Created habit", habitData.title);

    } catch (error) {
      console.error("API error: ", error);
    }

    closeHabitWindow();

});


//=========================
// MODIFY HABIT
//=========================

//edit habit window function
/**
 * Opens the habit edit window to allow the user to modify a habit.
 *
 * Displays the edit window and sets its data attributes and input fields with the provided habit's information.
 *
 * @param {Object} habit - The habit to edit.
 * @param {string|number} habit.id - The habit's unique identifier.
 * @param {string} habit.title - The habit's title.
 * @param {string} habit.frequency - The habit's frequency.
 * @param {HTMLElement} li - The list item element associated with the habit.
 */
function openHabitEdit(habit, li) {
  const editHabitWindow = document.getElementById("edit-habit");
  editHabitWindow.style.display = "block";
  editHabitWindow.dataset.habitId = li.dataset.habitId;
  editHabitWindow.dataset.title = habit.title;

  const editHabitName = document.getElementById("edit-habit-name");
  const editHabitFrequency = document.getElementById("edit-habit-frequency");
  editHabitName.value = habit.title;
  editHabitFrequency.value = habit.frequency;

}

/**
 * Closes the habit edit window.
 *
 * Hides the edit window by setting its display style to "none".
 */
function closeHabitEditWindow() {
  document.getElementById("edit-habit").style.display = "none";
}

//toggle habit complete function
/**
 * Toggles the completion status of a habit.
 *
 * Sends a PUT request to update the habit's completion status on the server.
 * On success, updates the habit object and the checkbox state.
 *
 * @async
 * @param {Object} habit - The habit object containing current details.
 * @param {number|string} habit.id - The unique identifier for the habit.
 * @param {string} habit.title - The title of the habit.
 * @param {string} habit.frequency - The frequency of the habit.
 * @param {boolean} habit.complete - The current completion status.
 * @param {number} habit.daysComplete - The current completion streak.
 * @param {HTMLElement} li - The list item element for the habit.
 * @param {HTMLInputElement} checkbox - The checkbox element that was clicked.
 */
async function habitComplete(habit, li, checkbox) {
  const updateComplete = !habit.complete;
  const habitId = habit.id;
  const habitTitle = habit.title;
  const habitStreak = habit.daysComplete;

  try {
    const response = await fetch(`/api/habits/${habitId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: updateComplete,
        title: habitTitle,
        habitStreak: habitStreak + 1,
        frequency: habit.frequency
      }),
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    habit.complete = updateComplete;
    checkbox.checked = updateComplete;
  } catch (error) {
    console.error("error updating habit complete: ", error);
    checkbox.checked = habit.complete;
  }
}

/*
//function for the edit window button
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
*/
//=========================
// DELETE HABIT
//=========================

/*getElementById("delete-btn").addEventListener("click", async () => {
  if (confirm(`Delete this item? ${habit.title}`)) {
    const success = await deleteHabit(habit.id);
    if (success) {
      li.remove();
    } else {
      alert("error deleting habit from sql server");
    }
  }
});

async function deleteHabit(habit) {
  if (confirm(`Delete this item? ${habit.title}`)) {
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      li.remove();
      return true;
    } catch (error) {
      console.error("delete failed:", error);
      return false;
    }
  }
}*/

/**
 * Handles the deletion of a habit from the edit window.
 *
 * Retrieves the habit id and title, confirms with the user, and if confirmed,
 * sends a request to delete the habit. If successful, the habit element is removed
 * from the DOM and the edit window is closed.
 *
 * @async
 * @event click on the delete habit button (#deleteHabitButton)
 */
const deleteHabitButton = document.getElementById("deleteHabitButton");
deleteHabitButton.addEventListener("click", async () => {
  const habitId = document.getElementById("edit-habit").dataset.habitId;
  const habitTitle = document.getElementById("edit-habit").dataset.title;
  const li = document.querySelector(`li[data-habit-id="${habitId}"]`);

    if (confirm(`Delete this item? "${habitTitle}"`)) {
      const success = await deleteHabit(habitId);
      if (success) {
        if(li) {
          li.remove();
          closeHabitEditWindow();
        }
        
      } else {
        alert("error deleting habit from sql server");
      }
    }
});

/**
 * Deletes a habit from the server.
 *
 * Sends a DELETE request to the API to remove the habit with the specified id.
 *
 * @async
 * @param {(number|string)} habitId - The unique identifier of the habit to delete.
 * @returns {Promise<boolean>} Resolves to true if deletion was successful, or false otherwise.
 */
async function deleteHabit(habitId) {
  try {
    const response = await fetch(`/api/habits/${habitId}`, {
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
