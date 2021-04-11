import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as route53 from '@aws-cdk/aws-route53';
import * as cert from '@aws-cdk/aws-certificatemanager'
import * as targets from '@aws-cdk/aws-route53-targets';
import * as apigw from '@aws-cdk/aws-apigateway'
export interface ReactAppProps {
  apiEndpoint: string,
  reactAppName: string,
  bucketPrefix: string,
}

export class ReactApp extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: ReactAppProps) {
    super(scope, id)

    const reactAppBucket = new s3.Bucket(this, "ssr-site", {
      bucketName: `${props.bucketPrefix}-react-app-${props.reactAppName}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      // only for demo not to use in production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
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
        API_ENDPOINT: props.apiEndpoint,
        STATIC_WEBSITE: reactAppBucket.bucketWebsiteDomainName,
      }
    })

    const domainName = `${props.reactAppName}.${process.env.HOSTED_ZONE_NAME}`

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'App Hosted Zone', {
      hostedZoneId: process.env.HOSTED_ZONE_ID || '',
      zoneName: process.env.HOSTED_ZONE_NAME || '',
    })
    const certificate = new cert.Certificate(this, 'AppCertificate', {
      domainName: domainName,
      validation: cert.CertificateValidation.fromDns(hostedZone)
    });

    const appApiGateway = new apigw.LambdaRestApi(this, 'Home', {
      handler: handler,
      proxy: true,
      domainName: {
        domainName: domainName,
        certificate,
      }
    })
    new route53.ARecord(this, 'CustomDomainAliasRecord', {
      recordName: domainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(appApiGateway))
    });


  }
}
