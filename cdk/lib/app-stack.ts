import * as cdk from '@aws-cdk/core';
import { ReactApp } from './reactapp'
import { Api } from './api'

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bucketPrefix = new cdk.CfnParameter(this, 'bucketPrefix', {
      type: 'String',
      description: 'Unique prefix of the s3 bucket',
    })

    const api = new Api(this, 'Api');

    new ReactApp(this, 'ReactApp', {
      apiUrl: api.endpointUrl,
      reactAppName: props && props.stackName || 'default',
      bucketPrefix: bucketPrefix.valueAsString,
    });
  }
}
