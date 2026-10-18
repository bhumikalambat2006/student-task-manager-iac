
variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "worker_name" {
  description = "Worker name"
  type        = string
  default     = "student-task-manager"
}

variable "kv_namespace_name" {
  description = "KV storage namespace"
  type        = string
  default     = "student_tasks"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
}
