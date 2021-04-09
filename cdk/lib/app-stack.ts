import * as cdk from '@aws-cdk/core';
import { ReactApp } from './reactapp'
import { Api } from './api'

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const reactAppBucketName = new cdk.CfnParameter(this, "reactAppBucketName", {
      type: "String",
      description: "The name of S3 bucket to upload react application"
    });
    const api = new Api(this, 'Api');
    new ReactApp(this, 'ReactApp', {
      apiUrl: api.endpointUrl,
      bucketName: reactAppBucketName.valueAsString,
    });

  }
}
