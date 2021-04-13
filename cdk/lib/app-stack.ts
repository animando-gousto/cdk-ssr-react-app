import * as cdk from '@aws-cdk/core';
import { ReactApp } from './reactapp'

interface StackProps extends cdk.StackProps {
  suffix: string,
}

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id, props);

    const bucketPrefix = new cdk.CfnParameter(this, 'bucketPrefix', {
      type: 'String',
      description: 'Unique prefix of the s3 bucket',
    })

    new ReactApp(this, 'ReactApp', {
      suffix: props.suffix,
      bucketPrefix: bucketPrefix.valueAsString,
    });
  }
}
