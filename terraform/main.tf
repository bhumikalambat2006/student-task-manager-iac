
# 1. Create Cloudflare Workers KV Namespace

resource "cloudflare_workers_kv_namespace" "tasks" {
  account_id = var.account_id
  title      = var.kv_namespace_name
}

# 2. Deploy Cloudflare Worker with Frontend and Backend

resource "cloudflare_workers_script" "app" {
  account_id  = var.account_id
  script_name = var.worker_name

  # Generated Worker containing HTML, CSS, JS and API
  content_file   = "${path.module}/../application/worker-deploy.js"
  content_sha256 = filesha256("${path.module}/../application/worker-deploy.js")

  content_type = "application/javascript+module"
  main_module  = "worker.js"

  # Connect existing KV namespace to Worker
  bindings = [
    {
      type         = "kv_namespace"
      name         = "TASKS_KV"
      namespace_id = cloudflare_workers_kv_namespace.tasks.id
    }
  ]
}

# 3. Enable Cloudflare workers.dev URL

resource "cloudflare_workers_script_subdomain" "app" {
  account_id  = var.account_id
  script_name = cloudflare_workers_script.app.script_name
  enabled     = true
}
