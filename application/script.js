
const API_URL =
  "https://student-task-manager.bhumikalambat2006.workers.dev/api/tasks";

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
}

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Unable to load tasks");

    const tasks = await response.json();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      showMessage("No tasks available. Add your first task!");
      return;
    }

    showMessage("");

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "task";

      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = task.title;

      const info = document.createElement("p");
      info.textContent =
        `Priority: ${task.priority} | Status: ${task.status}`;

      details.append(title, info);

      const actions = document.createElement("div");
      actions.className = "actions";

      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.disabled = task.status === "Completed";
      completeButton.addEventListener("click", () => {
        updateTask(task.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-btn";
      deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
      });

      actions.append(completeButton, deleteButton);
      card.append(details, actions);
      taskList.appendChild(card);
    });
  } catch (error) {
    showMessage(error.message);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const priority = document.getElementById("priority").value;

  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title,
        priority,
        status: "Pending"
      })
    });

    if (!response.ok) throw new Error("Failed to add task");

    form.reset();
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
});

async function updateTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status: "Completed"})
    });

    if (!response.ok) throw new Error("Failed to update task");

    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Failed to delete task");

    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

loadTasks();
