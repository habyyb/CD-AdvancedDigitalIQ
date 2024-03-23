from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_eks as eks,
    aws_iam as iam,   
    aws_secretsmanager as secretsmanager,
    lambda_layer_kubectl as llk
)
from constructs import Construct




class DigitalQSetupStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Define the VPC
        vpc = ec2.Vpc(self, "DigitalQVPC", max_azs=3)

        # Define the Cluster Role
        cluster_role = iam.Role(self, "DigitalQClusterRole",
            role_name="Digital-Q-Cluster-Role",
            assumed_by=iam.ServicePrincipal("eks.amazonaws.com"), 
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonEKSClusterPolicy"), 
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonEKSServicePolicy"),
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonEKSWorkerNodePolicy")
                ])

       
        # Allow specified IAM users to assume role
        cluster_role.assume_role_policy.add_statements(iam.PolicyStatement(
            actions=["sts:AssumeRole"],
        # Add principals who can assume the cluster role and administer it
        # If this is not granted, nobody can access and administer the cluster
        # Example: "arn:aws:sts::<ACCOUNT_ID>:assumed-role/AWSReservedSSO_AdministratorAccess_1cb50e22e06e1d09/Flavio"
            principals=[
                iam.ArnPrincipal(""),
                iam.ArnPrincipal(""),
                ...
            ]
        ))

        # Define the EKS cluster
        cluster = eks.Cluster(self, "DigitalQcluster",
            cluster_name="Digital-Q-cluster",
            version=eks.KubernetesVersion.V1_27,
            kubectl_layer=llk.KubectlLayer(self, "KubectlLayer"),
            vpc=vpc,
            vpc_subnets=[ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS)],
            default_capacity=0,
            masters_role=cluster_role,
            output_masters_role_arn=True,
            output_cluster_name=True
        )

        cluster.add_nodegroup_capacity("digital-q-spot",
            instance_types=[
                ec2.InstanceType("t3.large")
            ],
            min_size=2,
            capacity_type=eks.CapacityType.SPOT
        )