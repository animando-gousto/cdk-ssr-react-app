import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';

import * as apigw from '@aws-cdk/aws-apigateway'
export interface HitCounterProps {
  downstream: lambda.IFunction,
}

export class ReactApp extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const handler = new lambda.Function(this, 'ReactAppHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../react-app/server-build'),
    })

    new apigw.LambdaRestApi(this, 'Home', {
      handler: handler,
    })

  }
}
