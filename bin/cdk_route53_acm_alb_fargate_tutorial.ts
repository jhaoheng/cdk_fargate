#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkRoute53AcmAlbFargateTutorialStack } from '../lib/cdk_route53_acm_alb_fargate_tutorial-stack';

const app = new cdk.App();
new CdkRoute53AcmAlbFargateTutorialStack(app, 'CdkRoute53AcmAlbFargateTutorialStack');
