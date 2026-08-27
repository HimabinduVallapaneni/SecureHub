# SecureHub Terraform

This folder provisions the AWS infrastructure required to run SecureHub on Amazon EKS.

## What Terraform Creates

```text
AWS
│
├── VPC
├── Public Subnet - AZ1
├── Public Subnet - AZ2
├── Internet Gateway
├── Route Tables
├── IAM Roles
├── EKS Cluster
└── Managed EC2 Node Group
```

## Prerequisites

Install:

- Terraform
- AWS CLI
- kubectl

You also need an AWS account with permissions to create VPC, IAM, EC2, and EKS resources.

## 1. Authenticate to AWS

Authenticate using your own AWS account:

```bash
aws login
```

Verify the active identity:

```bash
aws sts get-caller-identity
```

Do not store AWS credentials inside Terraform files or the Git repository.

## 2. Clone the Repository

```bash
git clone https://github.com/HimabinduVallapaneni/SecureHub.git
cd SecureHub
git checkout devops
```

## 3. Open the Terraform Directory

```bash
cd terraform
```

## 4. Review Local Configuration

Terraform values can be customized in:

```text
terraform.tfvars
```

Example:

```hcl
aws_region         = "us-east-1"
project_name       = "securehub"
cluster_name       = "securehub-eks"
kubernetes_version = "1.35"

node_instance_type = "t3.medium"

node_desired_size = 1
node_min_size     = 1
node_max_size     = 1
```

`terraform.tfvars` is intentionally ignored by Git so each user can provide their own local configuration.

## 5. Initialize Terraform

```bash
terraform init
```

## 6. Format and Validate

```bash
terraform fmt
terraform validate
```

Expected validation result:

```text
Success! The configuration is valid.
```

## 7. Review the Infrastructure Plan

```bash
terraform plan
```

Review the resources Terraform intends to create before applying any changes.

## 8. Create the AWS Infrastructure

```bash
terraform apply
```

Terraform will display the execution plan and ask for confirmation.

Enter:

```text
yes
```

Terraform will then provision the VPC, networking, IAM resources, EKS cluster, and managed node group.

## 9. Configure kubectl

After Terraform completes, configure kubectl to connect to the new EKS cluster:

```bash
aws eks update-kubeconfig --region us-east-1 --name securehub-eks
```

If you changed the region or cluster name in `terraform.tfvars`, use those values instead.

Verify cluster connectivity:

```bash
kubectl get nodes
```

A successful result should show the EKS worker node in `Ready` status.

## 10. View Terraform Outputs

```bash
terraform output
```

Useful outputs include:

- EKS cluster name
- Cluster endpoint
- AWS region
- VPC ID
- Public subnet IDs
- kubectl configuration command

## Destroy the Environment

This environment is intended for temporary demos and testing.

After finishing, destroy the AWS resources to avoid unnecessary charges:

```bash
terraform destroy
```

Review the destroy plan and enter:

```text
yes
```

## Important Notes
- Each user must authenticate with their own AWS account.
- `terraform.tfvars` is local and ignored by Git.
- Terraform state files are local and must not be committed.
- The EKS environment incurs AWS charges while it is running.
- Run `terraform destroy` after completing the demo.