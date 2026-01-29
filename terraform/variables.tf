variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devops-project"
}

variable "db_username" {
  description = "RDS root username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "RDS root password"
  type        = string
  sensitive   = true
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "my-keypair"
}
