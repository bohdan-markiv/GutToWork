import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class CdkFirstStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Dynamo database
    const table = new dynamodb.Table(this, 'cars-cdk-table', {
      partitionKey: { name: 'license-plate', type: dynamodb.AttributeType.STRING },
      tableName: 'cars-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Import OpenAPI specification from file
    const openApiSpec = apigateway.AssetApiDefinition.fromAsset('./services/api.yaml');

    // Create a SpecRestApi using the OpenAPI specification
    const api = new apigateway.SpecRestApi(this, 'cars-cdk-api', {
      apiDefinition: openApiSpec
    });

    // Define a list with lambda names
    const lambdaNames = [
      { name: 'cars-get-bohdan2', handler: 'index.handler' },
      { name: 'cars-post-bohdan2', handler: 'index.handler' },
      { name: 'cars-licenseplate-get-bohdan2', handler: 'index.handler' },
      { name: 'cars-licenseplate-put-bohdan2', handler: 'index.handler' },
      { name: 'cars-licenseplate-delete-bohdan2', handler: 'index.handler' }
    ];

    // Iterate over the list and create a Lambda function for each name
    lambdaNames.forEach((lambdaConfig) => {
      const lambdaFn = new lambda.Function(this, lambdaConfig.name, {
        runtime: lambda.Runtime.NODEJS_18_X,
        functionName: lambdaConfig.name,
        handler: lambdaConfig.handler,
        code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/${lambdaConfig.name}`)),
        environment: {
          'DYNAMO_TABLE_NAME': table.tableName // Use the table name from the DynamoDB table construct
        }
      });

      // Grant API Gateway permissions to invoke the Lambda function
      lambdaFn.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
      table.grantReadWriteData(lambdaFn);
    });


    // Output the API Gateway endpoint URL to the CLI
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `https://${api.restApiId}.execute-api.${this.region}.amazonaws.com/`,
      description: 'The URL of the API Gateway endpoint',
    });
  }
}

const app = new cdk.App();
new CdkFirstStack(app, 'ApiGatewayLambdaExample');
