import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'
import * as route53 from '@aws-cdk/aws-route53';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as alias from '@aws-cdk/aws-route53-targets';

const DomainName = process.env.MyDomainName!;
const ApplicationDomainName = `yoyo.${DomainName}`;

export class CdkRoute53AcmAlbFargateTutorialStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // default vpc
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true
    })

    // ecs
    const ecsCluster = new ecs.Cluster(this, 'ECSCluster', { vpc })
    const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    })
    taskDefinition.addContainer('container', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample')
    }).addPortMappings({
      containerPort: 80,
    })
    const svc = new ecs.FargateService(this, 'SVC', {
      cluster: ecsCluster,
      taskDefinition: taskDefinition
    })

    // acm cert
    const cert = new acm.Certificate(this, 'Cert', {
      domainName: DomainName,
      subjectAlternativeNames: [
        `*.${DomainName}`
      ],
      validation: acm.CertificateValidation.fromDns()
    })

    // target group
    const tg = new elbv2.ApplicationTargetGroup(this, 'TG', {
      vpc,
      port: 80
    })
    tg.addTarget(svc)

    // elbv2
    const albListener = new elbv2.ApplicationListener(this, 'ALBListener', {
      loadBalancer: new elbv2.ApplicationLoadBalancer(this, 'ALB', {
        vpc,
        internetFacing: true
      }),
      certificates: [
        cert
      ],
      protocol: elbv2.ApplicationProtocol.HTTPS,
      defaultTargetGroups: [
        tg
      ],
    })

    // route53
    const hostedZone = route53.HostedZone.fromLookup(this, 'MyZone', {
      domainName: DomainName
    })
    const myUrl = new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new alias.LoadBalancerTarget(albListener.loadBalancer)),
      recordName: ApplicationDomainName
    });

    // output
    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: `https://${albListener.loadBalancer.loadBalancerDnsName}`
    })

    new cdk.CfnOutput(this, 'DomainName', {
      value: `https://${myUrl.domainName}`
    })
  }
}
