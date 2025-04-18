// habits.js

//=========================
// MAIN FUNCTION FOR
// CREATING LIST ITEMS
//=========================



//=========================
// GET HABITS
//=========================
/**
 * Initializes the habits list when the DOM content is loaded.
 *
 * Fetches habit data from the API endpoint "/api.habits" and appends each habit as a list item
 * into the element with the id "habits-list".
 *
 */
async function getAllHabits() {
  try {
    const response = await fetch("/api.habits");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    var habits = await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }

  return habits;
}


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
      daysComplete: 0,
      lastCompleted: null
    };

    closeHabitWindow();
    document.getElementById("habit-name").value = "";
    document.getElementById("habit-frequency").value = "Daily";

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
    } catch (error) {
      console.error("API error: ", error);
      return;
    }

    await initHabits();

    renderWidget("habits", 0);
    console.log("Created habit", habitData.title);
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
function openHabitEdit(habit) {
  const editHabitWindow = document.getElementById("edit-habit");
  editHabitWindow.style.display = "block";
  editHabitWindow.dataset.habitId = habit.id;
  editHabitWindow.dataset.title = habit.title;
  editHabitWindow.dataset.lastCompleted = habit.lastCompleted;

  if(habit.complete === true) {
    editHabitWindow.dataset.complete = 1;
  } else {
    editHabitWindow.dataset.complete = 0;
  };

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
 * @param {Date} habit.lastCompleted 
* @param {HTMLElement} li - The list item element for the habit.
 * @param {HTMLInputElement} checkbox - The checkbox element that was clicked.
 */
async function habitComplete(habit, li, checkbox) {
  const updateComplete = !habit.complete;
  const habitId = habit.id;
  const habitTitle = habit.title;
  const habitFrequency = habit.frequency;
  var habitStreak = habit.daysComplete;

  var habitLastCompleted = habit.lastCompleted;

  if (habitLastCompleted != null) {
    parts = habitLastCompleted.split("T")[0];
    parts = parts.split("-");
  
    habitLastCompleted = new Date(parts[0], parts[1] - 1, parts[2]);

    console.log(habitFrequency);

    if (habitFrequency === "Daily") {
      console.log(habitLastCompleted);
      console.log(currentDate);
      if (habitLastCompleted.getFullYear() !== currentDate.getFullYear() &&
      habitLastCompleted.getMonth() !== currentDate.getMonth() &&
      habitLastCompleted.getDate() !== currentDate.getDate()) {
        habitStreak += 1;
      }
    } else if (habitFrequency === "Weekly") {
      habitStreak += 1;
    } else if (habitFrequency === "Monthly") {
      if (habitLastCompleted.getMonth() !== currentDate.getMonth() &&
      habitLastCompleted.getDate() !== currentDate.getDate()) {
      habitStreak += 1;
    }
  } else {
    habitStreak += 1;
  }
  console.log(habitStreak);

  habitLastCompleted = currentDate;

  try {
    const response = await fetch(`/api/habits/${habitId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: updateComplete,
        title: habitTitle,
        habitStreak: habitStreak,
        frequency: habitFrequency,
        lastCompleted: habitLastCompleted
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
}

async function checkHabitStreak(habitStreak) {
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
  let currentTopStreak = stats.longestHabitStreak;
  if (currentTopStreak > habitStreak) {
    return;
  }

  stats.longestHabitStreak = habitStreak;

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

async function incrementHabitComplete() {
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

  stats.habitsCompleted++;

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
    closeHabitEditWindow();

    const success = await deleteHabit(habitId);
    if (success) {
      if(li) {
        li.remove();
        
        removeIndx = widgetData["habits"].findIndex(habit => habit.id == habitId);
        if (removeIndx > -1) {
          widgetData["habits"].splice(removeIndx, 1);
        }
        
        renderWidget("habits", 0);
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
    const response = await fetch(`/api/habits/` + habitId, { 
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
