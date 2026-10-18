
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
