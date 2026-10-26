const API = "/api/tasks";

const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

let editingId = null;

function notify(text) {
  message.textContent = text;
}

async function apiRequest(path = "", options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }

  return result;
}

function resetForm() {
  form.reset();
  editingId = null;
  saveButton.textContent = "Add Task";
  cancelButton.hidden = true;
  document.getElementById("formHeading").textContent = "Add New Task";
}

function makeButton(text, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", onClick);
  return button;
}

async function loadTasks() {
  notify("Loading tasks...");
  taskList.replaceChildren();

  try {
    const tasks = await apiRequest();

    if (!tasks.length) {
      notify("No tasks yet. Add your first task!");
      return;
    }

    notify(`${tasks.length} task(s) found`);

    for (const task of tasks) {
      const card = document.createElement("article");
      card.className = "task";

      const heading = document.createElement("h3");
      heading.textContent = task.title;

      const details = document.createElement("p");
      details.textContent =
        `Priority: ${task.priority} | Status: ${task.status}`;

      const actions = document.createElement("div");
      actions.className = "actions";

      actions.append(
        makeButton("Edit", "secondary", () => {
          editingId = task.id;
          titleInput.value = task.title;
          priorityInput.value = task.priority;
          statusInput.value = task.status;
          saveButton.textContent = "Save Changes";
          cancelButton.hidden = false;
          document.getElementById("formHeading").textContent = "Edit Task";
          titleInput.focus();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }),
        makeButton("Delete", "danger", async () => {
          if (!confirm(`Delete "${task.title}"?`)) return;

          try {
            await apiRequest(`/${encodeURIComponent(task.id)}`, {
              method: "DELETE"
            });
            if (editingId === task.id) resetForm();
            await loadTasks();
          } catch (error) {
            notify(error.message);
          }
        })
      );

      card.append(heading, details, actions);
      taskList.append(card);
    }
  } catch (error) {
    notify("Error: " + error.message);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    title: titleInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value
  };

  if (!data.title) return;

  saveButton.disabled = true;

  try {
    await apiRequest(
      editingId ? `/${encodeURIComponent(editingId)}` : "",
      {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(data)
      }
    );

    resetForm();
    await loadTasks();
  } catch (error) {
    notify("Error: " + error.message);
  } finally {
    saveButton.disabled = false;
  }
});

cancelButton.addEventListener("click", resetForm);
document.getElementById("refreshButton").addEventListener("click", loadTasks);

loadTasks();