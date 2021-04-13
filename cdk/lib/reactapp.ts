import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as route53 from '@aws-cdk/aws-route53';
import * as cert from '@aws-cdk/aws-certificatemanager'
import * as targets from '@aws-cdk/aws-route53-targets';
import * as apigw from '@aws-cdk/aws-apigateway'
export interface ReactAppProps {
  suffix: string,
  bucketPrefix: string,
}

export class ReactApp extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: ReactAppProps) {
    super(scope, id)

    const reactAppBucket = new s3.Bucket(this, "ssr-site", {
      bucketName: `${props.bucketPrefix}-react-app-${props.suffix}`,
      // only for demo not to use in production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new cdk.CfnOutput(this, "Bucket", { value: reactAppBucket.bucketName });

    new s3deploy.BucketDeployment(this, "Client-side React app", {
      sources: [s3deploy.Source.asset("../react-app/build/")],
      destinationBucket: reactAppBucket,
    });

    const domainName = `${props.suffix}.${process.env.HOSTED_ZONE_NAME}`

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'App Hosted Zone', {
      hostedZoneId: process.env.HOSTED_ZONE_ID!,
      zoneName: process.env.HOSTED_ZONE_NAME!,
    })
    const certificate = new cert.DnsValidatedCertificate(this, 'AppCertificate', {
      domainName: domainName,
      hostedZone,
    });

    const cfDistribution = new cloudfront.Distribution(this, 'S3CloudFront', {
      defaultBehavior: { origin: new origins.S3Origin(reactAppBucket) },
      // certificate: cloudFrontCertificate,
      // domainNames: [cfDomainName],
    })
    new cdk.CfnOutput(this, "CloudFront", { value: cfDistribution.distributionDomainName });

    const reactAppServerHandler = new lambda.Function(this, 'ReactAppHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../react-app/server-build'),
      environment: {
        API_ENDPOINT: process.env.API_ENDPOINT!,
        STATIC_WEBSITE: cfDistribution.distributionDomainName,
        SERVICE_TOKEN: process.env.SERVICE_TOKEN!,
      }
    })
    const appApiGateway = new apigw.LambdaRestApi(this, 'Home', {
      handler: reactAppServerHandler,
      proxy: true,
      restApiName: `ReactSsrApp-${props.suffix}`,
      domainName: {
        domainName: domainName,
        certificate,
      },
    })
    new route53.ARecord(this, 'CustomDomainAliasRecord', {
      recordName: domainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(appApiGateway))
    });
  }
}
