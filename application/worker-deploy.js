const FRONTEND_HTML = "\r\n\u003c!DOCTYPE html\u003e\r\n\u003chtml lang=\"en\"\u003e\r\n\u003chead\u003e\r\n  \u003cmeta charset=\"UTF-8\"\u003e\r\n  \u003cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\u003e\r\n  \u003ctitle\u003eStudent Task Manager\u003c/title\u003e\r\n  \u003clink rel=\"stylesheet\" href=\"style.css\"\u003e\r\n\u003c/head\u003e\r\n\u003cbody\u003e\r\n\r\n  \u003cdiv class=\"container\"\u003e\r\n    \u003cheader\u003e\r\n      \u003ch1\u003eðŸŽ“ Student Task Manager\u003c/h1\u003e\r\n      \u003cp\u003eOrganize your assignments and track your progress\u003c/p\u003e\r\n    \u003c/header\u003e\r\n\r\n    \u003csection class=\"form-card\"\u003e\r\n      \u003ch2\u003eAdd New Task\u003c/h2\u003e\r\n\r\n      \u003cform id=\"taskForm\"\u003e\r\n        \u003cinput type=\"text\" id=\"title\"\r\n          placeholder=\"Enter task title\" required\u003e\r\n\r\n        \u003cselect id=\"priority\"\u003e\r\n          \u003coption value=\"Low\"\u003eLow Priority\u003c/option\u003e\r\n          \u003coption value=\"Medium\" selected\u003eMedium Priority\u003c/option\u003e\r\n          \u003coption value=\"High\"\u003eHigh Priority\u003c/option\u003e\r\n        \u003c/select\u003e\r\n\r\n        \u003cbutton type=\"submit\"\u003e+ Add Task\u003c/button\u003e\r\n      \u003c/form\u003e\r\n    \u003c/section\u003e\r\n\r\n    \u003csection class=\"task-section\"\u003e\r\n      \u003ch2\u003eMy Tasks\u003c/h2\u003e\r\n      \u003cp id=\"message\"\u003e\u003c/p\u003e\r\n      \u003cdiv id=\"taskList\"\u003e\u003c/div\u003e\r\n    \u003c/section\u003e\r\n  \u003c/div\u003e\r\n\r\n  \u003cscript src=\"script.js\"\u003e\u003c/script\u003e\r\n\u003c/body\u003e\r\n\u003c/html\u003e\r\n";
const FRONTEND_CSS = "\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\nbody {\r\n  font-family: Arial, sans-serif;\r\n  background: linear-gradient(135deg, #e0e7ff, #f8fafc);\r\n  min-height: 100vh;\r\n  color: #1e293b;\r\n}\r\n\r\n.container {\r\n  max-width: 950px;\r\n  margin: 40px auto;\r\n  padding: 20px;\r\n}\r\n\r\nheader {\r\n  text-align: center;\r\n  margin-bottom: 35px;\r\n}\r\n\r\nheader h1 {\r\n  color: #4338ca;\r\n  font-size: 36px;\r\n}\r\n\r\nheader p {\r\n  color: #64748b;\r\n  margin-top: 10px;\r\n}\r\n\r\n.form-card,\r\n.task-section {\r\n  background: white;\r\n  padding: 25px;\r\n  border-radius: 16px;\r\n  margin-bottom: 25px;\r\n  box-shadow: 0 8px 25px rgba(0,0,0,0.07);\r\n}\r\n\r\nh2 {\r\n  margin-bottom: 20px;\r\n}\r\n\r\nform {\r\n  display: flex;\r\n  gap: 12px;\r\n  flex-wrap: wrap;\r\n}\r\n\r\ninput, select {\r\n  padding: 13px;\r\n  border: 1px solid #cbd5e1;\r\n  border-radius: 8px;\r\n  font-size: 15px;\r\n}\r\n\r\ninput {\r\n  flex: 1;\r\n  min-width: 200px;\r\n}\r\n\r\nbutton {\r\n  background: #4f46e5;\r\n  color: white;\r\n  border: none;\r\n  padding: 12px 18px;\r\n  border-radius: 8px;\r\n  cursor: pointer;\r\n}\r\n\r\nbutton:hover {\r\n  background: #3730a3;\r\n}\r\n\r\n.task {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 15px;\r\n  background: #f8fafc;\r\n  padding: 18px;\r\n  margin: 12px 0;\r\n  border-radius: 10px;\r\n  border-left: 5px solid #6366f1;\r\n}\r\n\r\n.task h3 {\r\n  margin-bottom: 8px;\r\n}\r\n\r\n.task p {\r\n  color: #64748b;\r\n}\r\n\r\n.actions {\r\n  display: flex;\r\n  gap: 8px;\r\n}\r\n\r\n.delete-btn {\r\n  background: #ef4444;\r\n}\r\n\r\n.delete-btn:hover {\r\n  background: #dc2626;\r\n}\r\n\r\n#message {\r\n  margin-bottom: 10px;\r\n  color: #475569;\r\n}\r\n\r\n@media (max-width: 600px) {\r\n  .task {\r\n    flex-direction: column;\r\n    align-items: flex-start;\r\n  }\r\n}\r\n";
const FRONTEND_JS = "\r\nconst API_URL =\r\n  \"https://student-task-manager.bhumikalambat2006.workers.dev/api/tasks\";\r\n\r\nconst form = document.getElementById(\"taskForm\");\r\nconst taskList = document.getElementById(\"taskList\");\r\nconst message = document.getElementById(\"message\");\r\n\r\nfunction showMessage(text) {\r\n  message.textContent = text;\r\n}\r\n\r\nasync function loadTasks() {\r\n  try {\r\n    const response = await fetch(API_URL);\r\n    if (!response.ok) throw new Error(\"Unable to load tasks\");\r\n\r\n    const tasks = await response.json();\r\n    taskList.innerHTML = \"\";\r\n\r\n    if (tasks.length === 0) {\r\n      showMessage(\"No tasks available. Add your first task!\");\r\n      return;\r\n    }\r\n\r\n    showMessage(\"\");\r\n\r\n    tasks.forEach(task =\u003e {\r\n      const card = document.createElement(\"div\");\r\n      card.className = \"task\";\r\n\r\n      const details = document.createElement(\"div\");\r\n      const title = document.createElement(\"h3\");\r\n      title.textContent = task.title;\r\n\r\n      const info = document.createElement(\"p\");\r\n      info.textContent =\r\n        `Priority: ${task.priority} | Status: ${task.status}`;\r\n\r\n      details.append(title, info);\r\n\r\n      const actions = document.createElement(\"div\");\r\n      actions.className = \"actions\";\r\n\r\n      const completeButton = document.createElement(\"button\");\r\n      completeButton.textContent = \"Complete\";\r\n      completeButton.disabled = task.status === \"Completed\";\r\n      completeButton.addEventListener(\"click\", () =\u003e {\r\n        updateTask(task.id);\r\n      });\r\n\r\n      const deleteButton = document.createElement(\"button\");\r\n      deleteButton.textContent = \"Delete\";\r\n      deleteButton.className = \"delete-btn\";\r\n      deleteButton.addEventListener(\"click\", () =\u003e {\r\n        deleteTask(task.id);\r\n      });\r\n\r\n      actions.append(completeButton, deleteButton);\r\n      card.append(details, actions);\r\n      taskList.appendChild(card);\r\n    });\r\n  } catch (error) {\r\n    showMessage(error.message);\r\n  }\r\n}\r\n\r\nform.addEventListener(\"submit\", async event =\u003e {\r\n  event.preventDefault();\r\n\r\n  const title = document.getElementById(\"title\").value.trim();\r\n  const priority = document.getElementById(\"priority\").value;\r\n\r\n  if (!title) return;\r\n\r\n  try {\r\n    const response = await fetch(API_URL, {\r\n      method: \"POST\",\r\n      headers: {\"Content-Type\": \"application/json\"},\r\n      body: JSON.stringify({\r\n        title,\r\n        priority,\r\n        status: \"Pending\"\r\n      })\r\n    });\r\n\r\n    if (!response.ok) throw new Error(\"Failed to add task\");\r\n\r\n    form.reset();\r\n    await loadTasks();\r\n  } catch (error) {\r\n    showMessage(error.message);\r\n  }\r\n});\r\n\r\nasync function updateTask(id) {\r\n  try {\r\n    const response = await fetch(`${API_URL}/${id}`, {\r\n      method: \"PUT\",\r\n      headers: {\"Content-Type\": \"application/json\"},\r\n      body: JSON.stringify({status: \"Completed\"})\r\n    });\r\n\r\n    if (!response.ok) throw new Error(\"Failed to update task\");\r\n\r\n    await loadTasks();\r\n  } catch (error) {\r\n    showMessage(error.message);\r\n  }\r\n}\r\n\r\nasync function deleteTask(id) {\r\n  if (!confirm(\"Delete this task?\")) return;\r\n\r\n  try {\r\n    const response = await fetch(`${API_URL}/${id}`, {\r\n      method: \"DELETE\"\r\n    });\r\n\r\n    if (!response.ok) throw new Error(\"Failed to delete task\");\r\n\r\n    await loadTasks();\r\n  } catch (error) {\r\n    showMessage(error.message);\r\n  }\r\n}\r\n\r\nloadTasks();\r\n";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(FRONTEND_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (request.method === "GET" && url.pathname === "/style.css") {
      return new Response(FRONTEND_CSS, {
        headers: { "Content-Type": "text/css; charset=utf-8" }
      });
    }

    if (request.method === "GET" && url.pathname === "/script.js") {
      return new Response(FRONTEND_JS, {
        headers: { "Content-Type": "application/javascript; charset=utf-8" }
      });
    }

    if (url.pathname === "/api/tasks") {
      if (request.method === "POST") {
        const data = await request.json();

        if (!data.title || !data.title.trim()) {
          return Response.json(
            { error: "Title is required" },
            { status: 400 }
          );
        }

        const task = {
          id: crypto.randomUUID(),
          title: data.title.trim(),
          priority: data.priority || "Medium",
          status: data.status || "Pending",
          createdAt: new Date().toISOString()
        };

        await env.TASKS_KV.put(
          task.id,
          JSON.stringify(task)
        );

        return Response.json(task, { status: 201 });
      }

      if (request.method === "GET") {
        const tasks = [];
        let cursor;

        do {
          const page = await env.TASKS_KV.list({ cursor });

          const values = await Promise.all(
            page.keys.map(key =>
              env.TASKS_KV.get(key.name, "json")
            )
          );

          tasks.push(...values.filter(Boolean));
          cursor = page.list_complete ? undefined : page.cursor;
        } while (cursor);

        return Response.json(tasks);
      }
    }

    const match = url.pathname.match(
      /^\/api\/tasks\/([^/]+)$/
    );

    if (match) {
      const id = match[1];
      const task = await env.TASKS_KV.get(id, "json");

      if (!task) {
        return Response.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }

      if (request.method === "GET") {
        return Response.json(task);
      }

      if (request.method === "PUT") {
        const changes = await request.json();
        const updated = {
          ...task,
          title: changes.title ?? task.title,
          priority: changes.priority ?? task.priority,
          status: changes.status ?? task.status
        };

        await env.TASKS_KV.put(
          id,
          JSON.stringify(updated)
        );

        return Response.json(updated);
      }

      if (request.method === "DELETE") {
        await env.TASKS_KV.delete(id);
        return Response.json({ message: "Deleted" });
      }
    }

    return Response.json({
      message: "Student Task Manager API is running"
    });
  }
};

