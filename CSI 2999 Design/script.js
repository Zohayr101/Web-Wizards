// script.js


const tasksToDo = [];
const todayList = document.getElementById("today-list");
const sevenDayList = document.getElementById("7day-list");
const thirtyDayList = document.getElementById("30day-list");

function addTaskWindow() {
  document.getElementById("taskModal").style.display = "block";
}

function closeTaskWindow() {
  document.getElementById("taskModal").style.display = "none";
}

function addTask(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  const taskName = document.getElementById("taskName").value;
  const taskDueDate = document.getElementById("taskDueDate").value;

  // push into the array
  tasksToDo.push({ toDoName: taskName, toDoDueDate: taskDueDate });

  // close modal and reset form
  closeTaskWindow();
  document.getElementById("addTaskForm").reset();

  // update the lists with the new task
  updateLists();

  //local storage
  localStorage.setItem("tasksToDo", JSON.stringify(tasksToDo));

}


function dateDiff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function updateLists() {
  // clear existing lists
  todayList.innerHTML = "";
  sevenDayList.innerHTML = "";
  thirtyDayList.innerHTML = "";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  tasksToDo.forEach(task => {
    const dueDate = new Date(task.toDoDueDate);
    dueDate.setHours(0, 0, 0, 0);

    // create <li>
    const li = document.createElement("li");
    li.textContent = `${task.toDoName} (Due: ${task.toDoDueDate})`;

    const diffDays = dateDiff(now, dueDate) + 1;
    //console.log(task.toDoDueDate + " " + diffDays); //log to see what the diff days is getting

    // put in list
    if (diffDays === 0) {
      todayList.appendChild(li);
    } else if (diffDays > 0 && diffDays <= 7) {
      sevenDayList.appendChild(li);
    } else if (diffDays > 7 && diffDays <= 30) {
      thirtyDayList.appendChild(li);
    }
  });
}

//get existing tasks on page load
window.addEventListener("load", () => {
    const saved = localStorage.getItem("tasksToDo");
    if (saved) {
      // Parse the JSON string back into an array of tasks
      const parsedTasks = JSON.parse(saved);
      // Spread the parsed tasks into our tasksToDo array
      tasksToDo.push(...parsedTasks);
    }
    // refresh UI
    updateLists();
  });





// Sample data for widgets
const widgetData = {
    today: ["Task 1", "Task 2", "Task 3", "Task 4"],
    week: ["Weekly Task 1", "Weekly Task 2", "Weekly Task 3"],
    month: ["Monthly Task 1", "Monthly Task 2", "Monthly Task 3", "Monthly Task 4", "Monthly Task 5"],
    goals: ["Goal 1", "Goal 2", "Goal 3", "Goal 4", "Goal 5"]
};

const widgetIndex = {
    today: 0,
    week: 0,
    month: 0,
    goals: 0
};

const ITEMS_PER_PAGE = 2;

function renderWidget(id) {
    const widget = document.getElementById(id);
    const data = widgetData[id];
    const start = widgetIndex[id] * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = data.slice(start, end);


    /******************************************************/
    //was getting errors after adding add task function with this line so comment for now. Need to debug.
    //widget.innerHTML = pageData.map(item => `<li><input type="checkbox"> ${item}</li>`).join("");
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

// Initialize all widgets
/******************************************************/
//was getting errors after adding add task function with this line so comment for now. Need to debug.
//Object.keys(widgetData).forEach(id => renderWidget(id));

// Highlight the current day
const highlightCurrentDay = () => {
    const today = new Date();
    const currentDate = today.getDate(); // Get the day (e.g., 17 for Jan 17)
    const cells = document.querySelectorAll(".calendar-cell");

    // Highlight the matching cell
    cells.forEach((cell) => {
        if (parseInt(cell.textContent) === currentDate) {
            cell.classList.add("current-day");
        }
    });
};

highlightCurrentDay();
