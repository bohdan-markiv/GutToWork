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

    // Create the DynamoDB table for cars
    const table = new dynamodb.Table(this, 'cars-cdk-table', {
      partitionKey: { name: 'car-id', type: dynamodb.AttributeType.STRING },
      tableName: 'cars-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create the ingredients table
    const ingredients_table = new dynamodb.Table(this, 'ingredients-table', {
      partitionKey: { name: 'ingredients-id', type: dynamodb.AttributeType.STRING },
      tableName: 'ingredients',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Import OpenAPI specification from file for cars
    const openApiSpecCars = apigateway.AssetApiDefinition.fromAsset('./services/dev/api.yaml');

    // Create a SpecRestApi using the OpenAPI specification for cars
    const apiCars = new apigateway.SpecRestApi(this, 'cars-cdk-api', {
      apiDefinition: openApiSpecCars,
    });

    // Import OpenAPI specification from file
    const openApiSpecProd = apigateway.AssetApiDefinition.fromAsset('./services/prod/api.yaml');

    // Create a SpecRestApi using the OpenAPI specification
    const apiProd = new apigateway.SpecRestApi(this, 'guttowork-api', {
      apiDefinition: openApiSpecProd,
    });


    // -------------------------------
    // Define Lambda functions (Python)
    // -------------------------------

    // cars-get-bohdan2
    const carsGetLambda = new lambda.Function(this, 'cars-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/dev/lambdas/cars-get`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    carsGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(carsGetLambda);


    // ingredients-get
    const ingredientsGetLambda = new lambda.Function(this, 'ingredients-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'ingredients-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/ingredients`)),
      environment: {
        'DYNAMO_TABLE_NAME': ingredients_table.tableName,
      },
    });
    ingredientsGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    ingredients_table.grantReadWriteData(ingredientsGetLambda);


    // cars-post-bohdan2
    const carsPostLambda = new lambda.Function(this, 'cars-post', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-post',
      handler: 'post.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/dev/lambdas/cars-post`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    carsPostLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(carsPostLambda);

    //ingredients-post
    const ingredientsPostLambda = new lambda.Function(this, 'ingredients-post', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'ingredients-post',
      handler: 'post.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/ingredients`)),
      environment: {
        'DYNAMO_TABLE_NAME': ingredients_table.tableName,
      },
    });
    ingredientsPostLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    ingredients_table.grantReadWriteData(ingredientsPostLambda);

    // cars-licenseplate-get
    const licensePlateGetLambda = new lambda.Function(this, 'cars-licenseplate-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/dev/lambdas/cars-licenseplate-get`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlateGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlateGetLambda);

    // ingredientId-get
    const ingredientIdGetLambda = new lambda.Function(this, 'ingredient-id-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'ingredient-id-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/ingredients/{ingredient_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': ingredients_table.tableName,
      },
    });
    ingredientIdGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    ingredients_table.grantReadWriteData(ingredientIdGetLambda);

    // cars-licenseplate-put-bohdan2
    const licensePlatePutLambda = new lambda.Function(this, 'cars-licenseplate-put', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-put',
      handler: 'put.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/dev/lambdas/cars-licenseplate-put`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlatePutLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlatePutLambda);

    // ingredientId-put
    const ingredientIdPutLambda = new lambda.Function(this, 'ingredient-id-put', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'ingredient-id-put',
      handler: 'put.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/ingredients/{ingredient_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': ingredients_table.tableName,
      },
    });
    ingredientIdPutLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    ingredients_table.grantReadWriteData(ingredientIdPutLambda);

    // cars-licenseplate-delete-bohdan2
    const licensePlateDeleteLambda = new lambda.Function(this, 'cars-licenseplate-delete', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'cars-licenseplate-delete',
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/dev/lambdas/cars-licenseplate-delete`)),
      environment: {
        'DYNAMO_TABLE_NAME': table.tableName,
      },
    });
    licensePlateDeleteLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    table.grantReadWriteData(licensePlateDeleteLambda);

    // ingredientId-delete
    const ingredientIdDeleteLambda = new lambda.Function(this, 'ingredient-id-delete', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'ingredient-id-delete',
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/ingredients/{ingredient_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': ingredients_table.tableName,
      },
    });
    ingredientIdDeleteLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    ingredients_table.grantReadWriteData(ingredientIdDeleteLambda);

    

    // -------------------------------
    // Output the API Gateway endpoint URL for cars
    // -------------------------------
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `https://${apiCars.restApiId}.execute-api.${this.region}.amazonaws.com/`,
      description: 'The URL of the API Gateway endpoint',
    });

       // -------------------------------
    // Output the API Gateway endpoint URL for ingredients
    // -------------------------------
    new cdk.CfnOutput(this, 'ApiProdEndpoint', {
      value: `https://${apiProd.restApiId}.execute-api.${this.region}.amazonaws.com/`,
      description: 'The URL of the API Gateway endpoint',
    });
  }
}

const app = new cdk.App();
new GutToWork(app, 'ApiGatewayLambdaExample');
