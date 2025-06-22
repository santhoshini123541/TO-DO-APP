// Get all DOM elements
const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterStatus = document.getElementById("filterStatus");
const sortOrder = document.getElementById("sortOrder");
const topMenuIcon = document.getElementById("topMenuIcon");
const topDropdown = document.getElementById("topDropdown");

// Load tasks from localStorage
let tasks = loadFromLocalStorage();

// Render on load
renderTasks();

// Add task when "Add" button is clicked
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (text !== "") {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      pinned: false,
      createdAt: new Date().toISOString(),
      deadline: deadline
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    taskInput.value = "";
    deadlineInput.value = "";
  }
});

// Toggle dropdown for filter/sort
topMenuIcon.addEventListener("click", () => {
  topDropdown.classList.toggle("show");
});

// Re-render when filters/sorting are changed
filterStatus.addEventListener("change", renderTasks);
sortOrder.addEventListener("change", renderTasks);

// Save tasks array to localStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filter = filterStatus.value;
  const order = sortOrder.value;
  let filteredTasks = [...tasks];

  // Apply filter
  if (filter === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  } else if (filter === "incomplete") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  }

  // Apply sort and pin priority
  filteredTasks.sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned;
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Loop through and create elements for each task
  filteredTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    if (task.completed) text.classList.add("completed");

    const deadlineText = document.createElement("div");
    deadlineText.className = "deadline-text";

    // Calculate time left or show 'Deadline passed'
    if (task.deadline) {
      const now = new Date();
      const deadlineDate = new Date(task.deadline);
      const timeDiff = deadlineDate - now;

      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        deadlineText.textContent = `${days}d ${remainingHours}h left`;
      } else {
        deadlineText.textContent = "Deadline passed";
        deadlineText.style.color = "red";
      }
    }

    const buttons = document.createElement("div");
    buttons.className = "task-actions";

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
    completeBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveToLocalStorage();

      // Trigger boom animation
      item.classList.add("boom");
      setTimeout(() => {
        item.classList.remove("boom");
        renderTasks();
      }, 400);
    });

    // Pin button
    const pinBtn = document.createElement("button");
    pinBtn.className = "pin-btn";
    pinBtn.innerHTML = `<i class="fa-solid fa-thumbtack"></i>`;
    pinBtn.addEventListener("click", () => {
      task.pinned = !task.pinned;
      saveToLocalStorage();
      renderTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveToLocalStorage();
      renderTasks();
    });

    // Add all buttons to task
    buttons.appendChild(completeBtn);
    buttons.appendChild(pinBtn);
    buttons.appendChild(deleteBtn);

    // Assemble task item
    item.appendChild(text);
    item.appendChild(deadlineText);
    item.appendChild(buttons);
    taskList.appendChild(item);
  });
}



















