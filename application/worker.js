
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
      return new Response(__INDEX_HTML__, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    if (request.method === "GET" && path === "/style.css") {
      return new Response(__STYLE_CSS__, {
        headers: {
          "Content-Type": "text/css; charset=utf-8"
        }
      });
    }

    if (request.method === "GET" && path === "/script.js") {
      return new Response(__SCRIPT_JS__, {
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
