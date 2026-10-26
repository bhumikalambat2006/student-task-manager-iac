resource "cloudflare_workers_kv_namespace" "tasks" {
  account_id = var.account_id
  title      = var.kv_namespace_name
}

resource "cloudflare_workers_script" "app" {
  account_id  = var.account_id
  script_name = var.worker_name

  main_module = "worker.js"

  content_file   = "${path.module}/../application/worker-deploy.js"
  content_sha256 = filesha256("${path.module}/../application/worker-deploy.js")

  bindings = [
    {
      name         = "TASKS_KV"
      type         = "kv_namespace"
      namespace_id = cloudflare_workers_kv_namespace.tasks.id
    },
    {
      name = "APP_ENV"
      type = "plain_text"
      text = var.environment
    }
  ]
}

resource "cloudflare_workers_script_subdomain" "app" {
  account_id  = var.account_id
  script_name = cloudflare_workers_script.app.script_name
  enabled     = true
}