import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

import * as apigw from '@aws-cdk/aws-apigateway'
export interface ReactAppProps {
  apiUrl: string,
  bucketName: string,
}

export class ReactApp extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: ReactAppProps) {
    super(scope, id)

    const reactAppBucket = new s3.Bucket(this, "ssr-site", {
      bucketName: props.bucketName,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      //only for demo not to use in production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      accessControl: s3.BucketAccessControl.PUBLIC_READ,
    });
    new cdk.CfnOutput(this, "Bucket", { value: reactAppBucket.bucketName });
    new cdk.CfnOutput(this, "BucketWebsite", { value: reactAppBucket.bucketWebsiteDomainName });

    new s3deploy.BucketDeployment(this, "Client-side React app", {
      sources: [s3deploy.Source.asset("../react-app/build/")],
      destinationBucket: reactAppBucket,
    });
    const handler = new lambda.Function(this, 'ReactAppHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../react-app/server-build'),
      environment: {
        API_ENDPOINT: props.apiUrl,
        STATIC_WEBSITE: reactAppBucket.bucketWebsiteDomainName,
      }
    })

    new apigw.LambdaRestApi(this, 'Home', {
      handler: handler,
      proxy: true,
    })

  }
}
