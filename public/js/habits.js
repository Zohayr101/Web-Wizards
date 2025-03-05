// habits.js

//=========================
// MAIN FUNCTION FOR
// CREATING LIST ITEMS
//=========================

function createHabitListItem(habit) {
  const li = document.createElement("li");
  li.dataset.habitId = habit.id;

  //checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = habit.complete;
  checkbox.addEventListener("click", () => {
    habitComplete(habit, li, checkbox);
  });

  //span
  const span = document.createElement("span");
  span.textContent = `Did you ${habit.title} today? Days streak: ${
    habit.daysComplete
  }`;

  //edit button
  const editButton = document.createElement("button");
  editButton.textContent = "✏";
  editButton.addEventListener("click", () => {
    openHabitEdit(habit, li);
  });

  //delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.addEventListener("click", async () => {
    if (confirm(`Delete this item? ${habit.title}`)) {
      const success = await deleteHabit(habit.id);
      if (success) {
        li.remove();
      } else {
        alert("error deleting habit from sql server");
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
// GET HABITS
//=========================

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

function addHabitWindow() {
  document.getElementById("add-habit").style.display = "block";
}
function closeHabitWindow() {
  document.getElementById("add-habit").style.display = "none";
}

document
  .getElementById("add-habit-button")
  .addEventListener("click", async function(habit) {
    habit.preventDefault();

    const habitName = document.getElementById("habit-name").value;
    const habitFrequency = document.getElementById("habit-frequency").value;

    const habitData = {
      title: habitName,
      frequency: habitFrequency,
      complete: false,
    };

    try {
      const response = await fetch("api/habits", {
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
      const li = createHabitListItem(habitData);

      habitsList.appendChild(li);
      console.log("Created habit", habitData.title);
    } catch (error) {
      console.error("API error: ", error);
    }

    closeHabitEditWindow();
});


//=========================
// MODIFY HABIT
//=========================

//edit habit window function
function openHabitEdit(habit, li) {
  const editHabitWindow = document.getElementById("edit-habit");
  editHabitWindow.style.display = "block";
  editHabitWindow.dataset.habitId = habit.id;

  const editHabitName = document.getElementById("edit-habit-name");
  const editHabitFrequency = document.getElementById("edit-habit-frequency");

  editHabitName.value = habit.title;
  editHabitFrequency.value = habit.frequency;
}

function closeHabitEditWindow() {
  document.getElementById("edit-habit").style.display = "none";
}

//toggle habit complete function
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
      }),
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", reponse.status);
    }

    habit.complete = updateComplete;
    checkbox.checked = updateComplete;
  } catch (error) {
    console.error("error updating habit complete: ", error);
    checkbox.checked = habit.complete;
  }
}


//=========================
// DELETE HABIT
//=========================

async function deleteHabit(habitId) {
  try {
    const response = await fetch(`/api/habits/${habitId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("delete failed:", error);
    return false;
  }
}
