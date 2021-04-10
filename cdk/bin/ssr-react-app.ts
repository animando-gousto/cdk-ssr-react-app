#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AppStack } from '../lib/app-stack';
const app = new cdk.App();

const reactAppName = new cdk.CfnParameter(app, "reactAppName", {
  type: "String",
  description: "The name of the react ap"
});
new AppStack(app, 'AppStack', {
  stackName: reactAppName.valueAsString
});
