
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ----------------------------------------
    // FRONTEND ROUTES
    // ----------------------------------------

    if (request.method === "GET" && path === "/") {
      return new Response("\u003c!DOCTYPE html\u003e\r\n\u003chtml lang=\"en\"\u003e\r\n\u003chead\u003e\r\n  \u003cmeta charset=\"UTF-8\"\u003e\r\n  \u003cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\u003e\r\n  \u003ctitle\u003eStudent Task Manager\u003c/title\u003e\r\n  \u003clink rel=\"stylesheet\" href=\"style.css\"\u003e\r\n\u003c/head\u003e\r\n\u003cbody\u003e\r\n  \u003cmain class=\"container\"\u003e\r\n    \u003cheader\u003e\r\n      \u003ch1\u003e📚 Student Task Manager\u003c/h1\u003e\r\n      \u003cp\u003eOrganize assignments, track progress, and stay productive.\u003c/p\u003e\r\n    \u003c/header\u003e\r\n\r\n    \u003csection class=\"panel\"\u003e\r\n      \u003ch2 id=\"formHeading\"\u003eAdd New Task\u003c/h2\u003e\r\n      \u003cform id=\"taskForm\"\u003e\r\n        \u003clabel for=\"title\"\u003eTask Title\u003c/label\u003e\r\n        \u003cinput id=\"title\" type=\"text\" placeholder=\"Enter assignment or task\" required\u003e\r\n\r\n        \u003clabel for=\"priority\"\u003ePriority\u003c/label\u003e\r\n        \u003cselect id=\"priority\"\u003e\r\n          \u003coption\u003eMedium\u003c/option\u003e\r\n          \u003coption\u003eHigh\u003c/option\u003e\r\n          \u003coption\u003eLow\u003c/option\u003e\r\n        \u003c/select\u003e\r\n\r\n        \u003clabel for=\"status\"\u003eStatus\u003c/label\u003e\r\n        \u003cselect id=\"status\"\u003e\r\n          \u003coption\u003ePending\u003c/option\u003e\r\n          \u003coption\u003eIn Progress\u003c/option\u003e\r\n          \u003coption\u003eCompleted\u003c/option\u003e\r\n        \u003c/select\u003e\r\n\r\n        \u003cdiv class=\"actions\"\u003e\r\n          \u003cbutton id=\"saveButton\" type=\"submit\"\u003eAdd Task\u003c/button\u003e\r\n          \u003cbutton id=\"cancelButton\" type=\"button\" class=\"secondary\" hidden\u003eCancel Edit\u003c/button\u003e\r\n        \u003c/div\u003e\r\n      \u003c/form\u003e\r\n    \u003c/section\u003e\r\n\r\n    \u003csection class=\"panel\"\u003e\r\n      \u003cdiv class=\"section-heading\"\u003e\r\n        \u003ch2\u003eMy Tasks\u003c/h2\u003e\r\n        \u003cbutton id=\"refreshButton\" type=\"button\" class=\"secondary\"\u003eRefresh\u003c/button\u003e\r\n      \u003c/div\u003e\r\n      \u003cp id=\"message\" role=\"status\"\u003e\u003c/p\u003e\r\n      \u003cdiv id=\"taskList\"\u003e\u003c/div\u003e\r\n    \u003c/section\u003e\r\n  \u003c/main\u003e\r\n  \u003cscript src=\"script.js\"\u003e\u003c/script\u003e\r\n\u003c/body\u003e\r\n\u003c/html\u003e", {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    if (request.method === "GET" && path === "/style.css") {
      return new Response("* { box-sizing: border-box; }\r\n\r\nbody {\r\n  margin: 0;\r\n  font-family: Arial, sans-serif;\r\n  background: #f1f5f9;\r\n  color: #172033;\r\n}\r\n\r\n.container {\r\n  max-width: 850px;\r\n  margin: 35px auto;\r\n  padding: 0 18px;\r\n}\r\n\r\nheader {\r\n  text-align: center;\r\n  padding: 30px 15px;\r\n}\r\n\r\nheader h1 {\r\n  color: #4f46e5;\r\n  margin-bottom: 8px;\r\n}\r\n\r\nheader p { color: #64748b; }\r\n\r\n.panel {\r\n  background: white;\r\n  padding: 25px;\r\n  margin-bottom: 22px;\r\n  border-radius: 15px;\r\n  box-shadow: 0 5px 20px #0f172a12;\r\n}\r\n\r\nh2 { margin-top: 0; }\r\n\r\nlabel {\r\n  display: block;\r\n  margin: 15px 0 6px;\r\n  font-weight: bold;\r\n}\r\n\r\ninput, select {\r\n  width: 100%;\r\n  padding: 12px;\r\n  border: 1px solid #cbd5e1;\r\n  border-radius: 8px;\r\n  font-size: 15px;\r\n}\r\n\r\n.actions, .section-heading {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 10px;\r\n}\r\n\r\n.actions { margin-top: 20px; }\r\n\r\nbutton {\r\n  background: #4f46e5;\r\n  color: white;\r\n  border: none;\r\n  border-radius: 8px;\r\n  padding: 11px 16px;\r\n  cursor: pointer;\r\n}\r\n\r\nbutton:hover { opacity: .88; }\r\nbutton:disabled { opacity: .5; cursor: wait; }\r\n\r\nbutton.secondary {\r\n  background: #e2e8f0;\r\n  color: #334155;\r\n}\r\n\r\nbutton.danger { background: #dc2626; }\r\n\r\n.task {\r\n  border: 1px solid #e2e8f0;\r\n  border-radius: 10px;\r\n  padding: 16px;\r\n  margin-top: 12px;\r\n}\r\n\r\n.task h3 { margin: 0 0 10px; }\r\n.task p { color: #64748b; }\r\n.task .actions { justify-content: flex-start; }\r\n\r\n#message { color: #475569; }\r\n\r\n[hidden] { display: none !important; }\r\n\r\n@media (max-width: 500px) {\r\n  .panel { padding: 16px; }\r\n  .actions { flex-wrap: wrap; }\r\n}", {
        headers: {
          "Content-Type": "text/css; charset=utf-8"
        }
      });
    }

    if (request.method === "GET" && path === "/script.js") {
      return new Response("const API = \"/api/tasks\";\r\n\r\nconst form = document.getElementById(\"taskForm\");\r\nconst titleInput = document.getElementById(\"title\");\r\nconst priorityInput = document.getElementById(\"priority\");\r\nconst statusInput = document.getElementById(\"status\");\r\nconst taskList = document.getElementById(\"taskList\");\r\nconst message = document.getElementById(\"message\");\r\nconst saveButton = document.getElementById(\"saveButton\");\r\nconst cancelButton = document.getElementById(\"cancelButton\");\r\n\r\nlet editingId = null;\r\n\r\nfunction notify(text) {\r\n  message.textContent = text;\r\n}\r\n\r\nasync function apiRequest(path = \"\", options = {}) {\r\n  const response = await fetch(API + path, {\r\n    ...options,\r\n    headers: {\r\n      \"Content-Type\": \"application/json\",\r\n      ...options.headers\r\n    }\r\n  });\r\n\r\n  const result = await response.json();\r\n\r\n  if (!response.ok) {\r\n    throw new Error(result.error || \"Request failed\");\r\n  }\r\n\r\n  return result;\r\n}\r\n\r\nfunction resetForm() {\r\n  form.reset();\r\n  editingId = null;\r\n  saveButton.textContent = \"Add Task\";\r\n  cancelButton.hidden = true;\r\n  document.getElementById(\"formHeading\").textContent = \"Add New Task\";\r\n}\r\n\r\nfunction makeButton(text, className, onClick) {\r\n  const button = document.createElement(\"button\");\r\n  button.type = \"button\";\r\n  button.textContent = text;\r\n  button.className = className;\r\n  button.addEventListener(\"click\", onClick);\r\n  return button;\r\n}\r\n\r\nasync function loadTasks() {\r\n  notify(\"Loading tasks...\");\r\n  taskList.replaceChildren();\r\n\r\n  try {\r\n    const tasks = await apiRequest();\r\n\r\n    if (!tasks.length) {\r\n      notify(\"No tasks yet. Add your first task!\");\r\n      return;\r\n    }\r\n\r\n    notify(`${tasks.length} task(s) found`);\r\n\r\n    for (const task of tasks) {\r\n      const card = document.createElement(\"article\");\r\n      card.className = \"task\";\r\n\r\n      const heading = document.createElement(\"h3\");\r\n      heading.textContent = task.title;\r\n\r\n      const details = document.createElement(\"p\");\r\n      details.textContent =\r\n        `Priority: ${task.priority} | Status: ${task.status}`;\r\n\r\n      const actions = document.createElement(\"div\");\r\n      actions.className = \"actions\";\r\n\r\n      actions.append(\r\n        makeButton(\"Edit\", \"secondary\", () =\u003e {\r\n          editingId = task.id;\r\n          titleInput.value = task.title;\r\n          priorityInput.value = task.priority;\r\n          statusInput.value = task.status;\r\n          saveButton.textContent = \"Save Changes\";\r\n          cancelButton.hidden = false;\r\n          document.getElementById(\"formHeading\").textContent = \"Edit Task\";\r\n          titleInput.focus();\r\n          window.scrollTo({ top: 0, behavior: \"smooth\" });\r\n        }),\r\n        makeButton(\"Delete\", \"danger\", async () =\u003e {\r\n          if (!confirm(`Delete \"${task.title}\"?`)) return;\r\n\r\n          try {\r\n            await apiRequest(`/${encodeURIComponent(task.id)}`, {\r\n              method: \"DELETE\"\r\n            });\r\n            if (editingId === task.id) resetForm();\r\n            await loadTasks();\r\n          } catch (error) {\r\n            notify(error.message);\r\n          }\r\n        })\r\n      );\r\n\r\n      card.append(heading, details, actions);\r\n      taskList.append(card);\r\n    }\r\n  } catch (error) {\r\n    notify(\"Error: \" + error.message);\r\n  }\r\n}\r\n\r\nform.addEventListener(\"submit\", async (event) =\u003e {\r\n  event.preventDefault();\r\n\r\n  const data = {\r\n    title: titleInput.value.trim(),\r\n    priority: priorityInput.value,\r\n    status: statusInput.value\r\n  };\r\n\r\n  if (!data.title) return;\r\n\r\n  saveButton.disabled = true;\r\n\r\n  try {\r\n    await apiRequest(\r\n      editingId ? `/${encodeURIComponent(editingId)}` : \"\",\r\n      {\r\n        method: editingId ? \"PUT\" : \"POST\",\r\n        body: JSON.stringify(data)\r\n      }\r\n    );\r\n\r\n    resetForm();\r\n    await loadTasks();\r\n  } catch (error) {\r\n    notify(\"Error: \" + error.message);\r\n  } finally {\r\n    saveButton.disabled = false;\r\n  }\r\n});\r\n\r\ncancelButton.addEventListener(\"click\", resetForm);\r\ndocument.getElementById(\"refreshButton\").addEventListener(\"click\", loadTasks);\r\n\r\nloadTasks();", {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8"
        }
      });
    }

    // ----------------------------------------
    // CORS PREFLIGHT
    // ----------------------------------------

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // ----------------------------------------
    // CHECK CLOUDFLARE KV BINDING
    // ----------------------------------------

    if (!env.TASKS_KV) {
      return json({ error: "KV binding missing" }, 500);
    }

    try {
      // --------------------------------------
      // GET ALL TASKS
      // --------------------------------------

      if (path === "/api/tasks" && request.method === "GET") {
        const tasks = [];
        let cursor;

        do {
          const result = await env.TASKS_KV.list({
            prefix: "task:",
            ...(cursor ? { cursor } : {})
          });

          const records = await Promise.all(
            result.keys.map(key =>
              env.TASKS_KV.get(key.name, "json")
            )
          );

          tasks.push(...records.filter(Boolean));

          cursor = result.list_complete
            ? undefined
            : result.cursor;

        } while (cursor);

        return json(tasks);
      }

      // --------------------------------------
      // ADD NEW TASK
      // --------------------------------------

      if (path === "/api/tasks" && request.method === "POST") {
        const data = await request.json();

        if (
          typeof data.title !== "string" ||
          !data.title.trim()
        ) {
          return json(
            { error: "Task title is required" },
            400
          );
        }

        const task = {
          id: crypto.randomUUID(),
          title: data.title.trim(),

          priority: ["High", "Medium", "Low"].includes(data.priority)
            ? data.priority
            : "Medium",

          status: ["Pending", "In Progress", "Completed"].includes(data.status)
            ? data.status
            : "Pending",

          createdAt: new Date().toISOString()
        };

        await env.TASKS_KV.put(
          `task:${task.id}`,
          JSON.stringify(task)
        );

        return json(task, 201);
      }

      // --------------------------------------
      // GET TASK ID FROM URL
      // --------------------------------------

      const match = path.match(/^\/api\/tasks\/([^/]+)$/);

      if (match) {
        const id = decodeURIComponent(match[1]);
        const key = `task:${id}`;

        // ------------------------------------
        // GET SINGLE TASK
        // ------------------------------------

        if (request.method === "GET") {
          const task = await env.TASKS_KV.get(key, "json");

          return task
            ? json(task)
            : json({ error: "Task not found" }, 404);
        }

        // ------------------------------------
        // UPDATE TASK
        // ------------------------------------

        if (request.method === "PUT") {
          const task = await env.TASKS_KV.get(key, "json");

          if (!task) {
            return json({ error: "Task not found" }, 404);
          }

          const data = await request.json();

          if (data.title !== undefined) {
            if (
              typeof data.title !== "string" ||
              !data.title.trim()
            ) {
              return json({ error: "Invalid title" }, 400);
            }

            task.title = data.title.trim();
          }

          if (data.priority !== undefined) {
            if (
              !["High", "Medium", "Low"].includes(data.priority)
            ) {
              return json({ error: "Invalid priority" }, 400);
            }

            task.priority = data.priority;
          }

          if (data.status !== undefined) {
            if (
              !["Pending", "In Progress", "Completed"].includes(data.status)
            ) {
              return json({ error: "Invalid status" }, 400);
            }

            task.status = data.status;
          }

          await env.TASKS_KV.put(
            key,
            JSON.stringify(task)
          );

          return json(task);
        }

        // ------------------------------------
        // DELETE TASK
        // ------------------------------------

        if (request.method === "DELETE") {
          const task = await env.TASKS_KV.get(key);

          if (task === null) {
            return json({ error: "Task not found" }, 404);
          }

          await env.TASKS_KV.delete(key);

          return json({
            message: "Task deleted successfully"
          });
        }
      }

      // --------------------------------------
      // INVALID ROUTE
      // --------------------------------------

      return json({ error: "Route not found" }, 404);

    } catch (error) {
      console.error(error);

      return json({
        error: "Request failed"
      }, 500);
    }
  }
};
