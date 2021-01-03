import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkRoute53AcmAlbFargateTutorial from '../lib/cdk_route53_acm_alb_fargate_tutorial-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkRoute53AcmAlbFargateTutorial.CdkRoute53AcmAlbFargateTutorialStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
