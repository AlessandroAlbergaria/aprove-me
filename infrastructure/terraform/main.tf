locals {
  common_labels = {
    app         = var.app_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false

  count = var.enable_cloud_run || var.enable_cloud_sql || var.enable_memorystore ? 1 : 0
}

resource "google_sql_database_instance" "postgres" {
  count = var.enable_cloud_sql ? 1 : 0

  name             = "${var.app_name}-db-${var.environment}"
  database_version = var.database_version
  region           = var.region

  settings {
    tier              = var.database_tier
    availability_type = "ZONAL"
    disk_size         = 10
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled            = true
      start_time         = "03:00"
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      ipv4_enabled    = true
      private_network = null
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "database" {
  count = var.enable_cloud_sql ? 1 : 0

  name     = var.app_name
  instance = google_sql_database_instance.postgres[0].name
}

resource "google_sql_user" "user" {
  count = var.enable_cloud_sql ? 1 : 0

  name     = "${var.app_name}_user"
  instance = google_sql_database_instance.postgres[0].name
  password = random_password.db_password[0].result
}

resource "random_password" "db_password" {
  count = var.enable_cloud_sql ? 1 : 0

  length  = 32
  special = true
}

resource "google_redis_instance" "cache" {
  count = var.enable_memorystore ? 1 : 0

  name           = "${var.app_name}-redis-${var.environment}"
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region
  tier           = "BASIC"

  redis_version = "REDIS_7_0"

  display_name = "${var.app_name} Redis Cache"
  labels       = local.common_labels
}

resource "google_cloud_run_service" "app" {
  count = var.enable_cloud_run ? 1 : 0

  name     = "${var.app_name}-${var.environment}"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.app_name}:latest"

        resources {
          limits = {
            cpu    = var.cloud_run_cpu
            memory = var.cloud_run_memory
          }
        }

        env {
          name  = "NODE_ENV"
          value = var.environment
        }

        env {
          name  = "PORT"
          value = "3000"
        }

        dynamic "env" {
          for_each = var.enable_cloud_sql ? [1] : []
          content {
            name  = "DATABASE_URL"
            value = "postgresql://${google_sql_user.user[0].name}:${random_password.db_password[0].result}@${google_sql_database_instance.postgres[0].connection_name}/${google_sql_database.database[0].name}"
          }
        }

        dynamic "env" {
          for_each = var.enable_memorystore ? [1] : []
          content {
            name  = "REDIS_HOST"
            value = google_redis_instance.cache[0].host
          }
        }

        dynamic "env" {
          for_each = var.enable_memorystore ? [1] : []
          content {
            name  = "REDIS_PORT"
            value = tostring(google_redis_instance.cache[0].port)
          }
        }
      }

      container_concurrency = 80
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = tostring(var.cloud_run_min_instances)
        "autoscaling.knative.dev/maxScale" = tostring(var.cloud_run_max_instances)
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_member" "public_access" {
  count = var.enable_cloud_run ? 1 : 0

  service  = google_cloud_run_service.app[0].name
  location = google_cloud_run_service.app[0].location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
