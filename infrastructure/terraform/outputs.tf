output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = var.enable_cloud_run ? google_cloud_run_service.app[0].status[0].url : "Not deployed (local mode)"
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = var.enable_cloud_sql ? google_sql_database_instance.postgres[0].connection_name : "Using local PostgreSQL"
  sensitive   = false
}

output "database_ip" {
  description = "Cloud SQL instance IP"
  value       = var.enable_cloud_sql ? google_sql_database_instance.postgres[0].public_ip_address : "localhost:5432"
}

output "database_name" {
  description = "Database name"
  value       = var.enable_cloud_sql ? google_sql_database.database[0].name : var.app_name
}

output "database_user" {
  description = "Database user"
  value       = var.enable_cloud_sql ? google_sql_user.user[0].name : "postgres"
  sensitive   = false
}

output "database_password" {
  description = "Database password (sensitive)"
  value       = var.enable_cloud_sql ? random_password.db_password[0].result : "Use local password"
  sensitive   = true
}

output "redis_host" {
  description = "Redis host"
  value       = var.enable_memorystore ? google_redis_instance.cache[0].host : "localhost"
}

output "redis_port" {
  description = "Redis port"
  value       = var.enable_memorystore ? google_redis_instance.cache[0].port : 6379
}

output "deployment_mode" {
  description = "Current deployment mode"
  value = var.enable_cloud_run ? "GCP Cloud" : "Local Docker"
}

output "summary" {
  description = "Infrastructure summary"
  value = {
    mode         = var.enable_cloud_run ? "GCP Cloud" : "Local Docker"
    database     = var.enable_cloud_sql ? "Cloud SQL" : "Local PostgreSQL"
    cache        = var.enable_memorystore ? "Cloud Memorystore" : "Local Redis"
    queue        = "RabbitMQ (always used)"
    compute      = var.enable_cloud_run ? "Cloud Run" : "Local Docker"
    environment  = var.environment
  }
}
