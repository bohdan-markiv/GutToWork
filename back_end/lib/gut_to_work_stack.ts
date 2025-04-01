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


    // Create the ingredients table
    const ingredients_table = new dynamodb.Table(this, 'ingredients-table', {
      partitionKey: { name: 'ingredients-id', type: dynamodb.AttributeType.STRING },
      tableName: 'ingredients',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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
