output "worker_name" {
  description = "Cloudflare Worker Name"
  value       = cloudflare_workers_script.app.script_name
}

output "kv_namespace_id" {
  description = "Cloudflare KV Namespace ID"
  value       = cloudflare_workers_kv_namespace.tasks.id
}

output "application_url" {
  description = "Student Task Manager Application URL"
  value       = "https://${var.worker_name}.bhumikalambat2006.workers.dev"
}