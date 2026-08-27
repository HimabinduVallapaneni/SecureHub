data "aws_availability_zones" "available" {
  state = "available"
}


locals {
  azs = slice(
    data.aws_availability_zones.available.names,
    0,
    2
  )

  public_subnets = [
    cidrsubnet(var.vpc_cidr, 8, 1),
    cidrsubnet(var.vpc_cidr, 8, 2)
  ]
}


module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.6.1"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs = local.azs

  public_subnets = local.public_subnets

  enable_nat_gateway = false
  single_nat_gateway = false

  enable_dns_support   = true
  enable_dns_hostnames = true

  map_public_ip_on_launch = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  tags = {
    Environment = "demo"
  }
}


module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.24.2"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  endpoint_public_access  = true
  endpoint_private_access = true

  enable_cluster_creator_admin_permissions = true

  vpc_id = module.vpc.vpc_id

  subnet_ids = module.vpc.public_subnets

  eks_managed_node_groups = {
    securehub = {
      name = "${var.project_name}-nodes"

      instance_types = [
        var.node_instance_type
      ]

      subnet_ids = module.vpc.public_subnets

      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size

      capacity_type = "ON_DEMAND"

      ami_type = "AL2023_x86_64_STANDARD"

      disk_size = 20

      labels = {
        workload = "securehub"
      }

      tags = {
        Name = "${var.project_name}-node"
      }
    }
  }

  tags = {
    Environment = "demo"
  }
}