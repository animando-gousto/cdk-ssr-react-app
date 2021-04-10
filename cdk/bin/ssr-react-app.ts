#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

const suffix = process.env.SUFFIX || 'default'
new AppStack(app, `SsrReactAppStack-${suffix}`, {
  stackName: `SsrReactAppStack-${suffix}`,
  suffix,
});
