import * as cdk from '@aws-cdk/core';
import { ReactApp } from './reactapp'

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new ReactApp(this, 'ReactApp');
  }
}
