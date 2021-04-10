#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

const stackName = process.env.STACK_NAME || 'default'
new AppStack(app, `AppStack-${stackName}`, {
  stackName,
});
