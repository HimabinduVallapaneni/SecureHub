output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS Kubernetes API endpoint"
  value       = module.eks.cluster_endpoint
}

output "aws_region" {
  description = "AWS region hosting SecureHub"
  value       = var.aws_region
}

output "vpc_id" {
  description = "SecureHub VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "node_group_name" {
  description = "SecureHub EKS managed node group"
  value       = "${var.project_name}-nodes"
}

output "configure_kubectl" {
  description = "Command to configure kubectl for SecureHub"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}