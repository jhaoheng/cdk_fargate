# Architecture
- Use default VPC
- ECS, Cluster, Fargate, TaskDefinition
- ALB, Targate Group, ACM
- Route53 use exist Hosted Zones

# Prerequisite
- Route53's Hosted Zones
- `npm i @aws-cdk/aws-{certificatemanager,elasticloadbalancingv2,ecs,route53,ec2,route53-targets}`

# Deploy Steps
1. Set DomainName = `export MyDomainName=....`
2. `cdk deploy`

# Destroy Steps
1. Set DomainName = `export MyDomainName=....`
2. `cdk destroy`