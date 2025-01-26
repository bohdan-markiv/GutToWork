#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkFirstStack } from '../lib/back_end-stack';

const app = new cdk.App();
new CdkFirstStack(app, 'CdkFirstStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
  // env: { account: '098667488212', region: 'eu-central-1' },
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_ACCOUNT }
});