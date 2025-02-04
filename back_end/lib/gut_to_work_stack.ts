import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class GutToWork extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the DynamoDB table
    const table = new dynamodb.Table(this, 'cars-cdk-table', {
      partitionKey: { name: 'car-id', type: dynamodb.AttributeType.STRING },
      tableName: 'cars-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Import OpenAPI specification from file
    const openApiSpec = apigateway.AssetApiDefinition.fromAsset('./services/api.yaml');

    // Create a SpecRestApi using the OpenAPI specification
    const api = new apigateway.SpecRestApi(this, 'cars-cdk-api', {
      apiDefinition: openApiSpec,
    });

    // -------------------------------
    // Define Lambda functions (Python)
    // -------------------------------

    // cars-get-bohdan2
    const carsGetLambda = new lambda.Function(this, 'cars-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/cars-get`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    carsGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(carsGetLambda);

    // cars-post-bohdan2
    const carsPostLambda = new lambda.Function(this, 'cars-post', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-post',
      handler: 'post.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/cars-post`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    carsPostLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(carsPostLambda);

    // cars-licenseplate-get
    const licensePlateGetLambda = new lambda.Function(this, 'cars-licenseplate-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/cars-licenseplate-get`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlateGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlateGetLambda);

    // cars-licenseplate-put-bohdan2
    const licensePlatePutLambda = new lambda.Function(this, 'cars-licenseplate-put', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-put',
      handler: 'put.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/cars-licenseplate-put`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlatePutLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlatePutLambda);

    // cars-licenseplate-delete-bohdan2
    const licensePlateDeleteLambda = new lambda.Function(this, 'cars-licenseplate-delete', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-delete',
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambdas/cars-licenseplate-delete`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlateDeleteLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlateDeleteLambda);

    // -------------------------------
    // Output the API Gateway endpoint URL
    // -------------------------------
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `https://${api.restApiId}.execute-api.${this.region}.amazonaws.com/`,
      description: 'The URL of the API Gateway endpoint',
    });
  }
}

const app = new cdk.App();
new GutToWork(app, 'ApiGatewayLambdaExample');
