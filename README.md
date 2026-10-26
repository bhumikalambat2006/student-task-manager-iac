# Student Task Manager — Infrastructure as Code

## Project Overview

Student Task Manager is a serverless web application for managing student assignments and tasks. The project uses Terraform to provision infrastructure on Cloudflare.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Cloudflare Workers
- **Database:** Cloudflare Workers KV
- **Infrastructure as Code:** Terraform
- **Version Control:** Git and GitHub
- **Continuous Integration:** GitHub Actions

## Features

- Add new tasks
- View existing tasks
- Update task details and status
- Delete tasks
- Store tasks using Cloudflare Workers KV
- Manage cloud infrastructure through Terraform

## Architecture

User Browser → Cloudflare Worker → Cloudflare Workers KV

The Cloudflare Worker serves the frontend and handles REST API requests. Task information is stored in Workers KV.

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Retrieve a specific task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Infrastructure Management

Terraform provisions and manages the Cloudflare Worker, KV namespace, and Worker subdomain.

Useful Terraform commands:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform state list
```

Terraform deployment requires valid Cloudflare credentials and the existing infrastructure state.

## Continuous Integration

GitHub Actions automatically validates Terraform configuration when changes are pushed to the `main` branch or a pull request is opened.

The CI workflow performs:

1. Repository checkout
2. Terraform installation
3. Terraform formatting check
4. Terraform initialization without backend
5. Terraform validation

Automatic production deployment is not yet configured.

## Live Application

https://student-task-manager.bhumikalambat2006.workers.dev

## GitHub Repository

https://github.com/bhumikalambat2006/student-task-manager-iac

## Author

Bhumika Lambat