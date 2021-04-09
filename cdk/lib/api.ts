import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';

import * as apigw from '@aws-cdk/aws-apigateway'

export class Api extends cdk.Construct {

  public readonly endpointUrl: string;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const handler = new lambda.Function(this, 'ApiLambda', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'api.handler',
      code: lambda.Code.fromAsset('../lambda/build'),
    })

    const apigateway = new apigw.LambdaRestApi(this, 'Api', {
      handler: handler,
    })

    this.endpointUrl = apigateway.url
  }
}
