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
   
    // Create the poop table
    const poop_table = new dynamodb.Table(this, 'poop-table', {
      partitionKey: { name: 'poop-id', type: dynamodb.AttributeType.STRING },
      tableName: 'poop',
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
    
    // poop-get
    const poopGetLambda = new lambda.Function(this, 'poop-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'poop-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/poop`)),
      environment: {
        'DYNAMO_TABLE_NAME': poop_table.tableName,
      },
    });
    poopGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    poop_table.grantReadWriteData(poopGetLambda);



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
    
    //poop-post
    const poopPostLambda = new lambda.Function(this, 'poop-post', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'poop-post',
      handler: 'post.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/poop`)),
      environment: {
        'DYNAMO_TABLE_NAME': poop_table.tableName,
      },
    });
    poopPostLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    poop_table.grantReadWriteData(poopPostLambda);


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
  
    // poopID-get
    const poopIdGetLambda = new lambda.Function(this, 'poop-id-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'poop-id-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/poop/{poop_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': poop_table.tableName,
      },
    });
    poopIdGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    poop_table.grantReadWriteData(poopIdGetLambda);


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


    // poopId-put
    const poopIdPutLambda = new lambda.Function(this, 'poop-id-put', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'poop-id-put',
      handler: 'put.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/poop/{poop_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': poop_table.tableName,
      },
    });
    poopIdPutLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    poop_table.grantReadWriteData(poopIdPutLambda);

 
    // poopId-delete
    const poopIdDeleteLambda = new lambda.Function(this, 'poop-id-delete', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'poop-id-delete',
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/poop/{poop_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': poop_table.tableName,
      },
    });
    poopIdDeleteLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    poop_table.grantReadWriteData(poopIdDeleteLambda);

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
