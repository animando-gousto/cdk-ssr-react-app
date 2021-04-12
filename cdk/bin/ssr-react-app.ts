#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

const suffix = process.env.SUFFIX!

const appStack = new AppStack(app, `SsrReactAppStack-${suffix}`, {
  stackName: `SsrReactAppStack-${suffix}`,
  suffix,
});

Tags.of(appStack).add('env-suffix', suffix)
