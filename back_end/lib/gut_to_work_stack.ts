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

   
    // Create the feelings table
    const feelings_table = new dynamodb.Table(this, 'feelings-table', {
      partitionKey: { name: 'feeling-id', type: dynamodb.AttributeType.STRING },
      tableName: 'feelings',
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

    // feelings-get
    const feelingsGetLambda = new lambda.Function(this, 'feelings-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'feelings-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/feelings`)),
      environment: {
        'DYNAMO_TABLE_NAME': feelings_table.tableName,
      },
    });
    feelingsGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    feelings_table.grantReadWriteData(feelingsGetLambda);
     

    //feelings-post
    const feelingsPostLambda = new lambda.Function(this, 'feelings-post', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'feelings-post',
      handler: 'post.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/feelings`)),
      environment: {
        'DYNAMO_TABLE_NAME': feelings_table.tableName,
      },
    });
    feelingsPostLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    feelings_table.grantReadWriteData(feelingsPostLambda);



    // feelingID-get
    const feelingIdGetLambda = new lambda.Function(this, 'feeling-id-get', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'feeling-id-get',
      handler: 'get.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/feelings/{feeling_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': feelings_table.tableName,
      },
    });
    feelingIdGetLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    feelings_table.grantReadWriteData(feelingIdGetLambda);

    
     // feelingId-put
     const feelingIdPutLambda = new lambda.Function(this, 'feeling-id-put', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'feeling-id-put',
      handler: 'put.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/feelings/{feeling_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': feelings_table.tableName,
      },
    });
    feelingIdPutLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    feelings_table.grantReadWriteData(feelingIdPutLambda);


    // feelingId-delete
    const feelingIdDeleteLambda = new lambda.Function(this, 'feeling-id-delete', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'feeling-id-delete',
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/prod/lambdas/feelings/{feeling_id}`)),
      environment: {
        'DYNAMO_TABLE_NAME': feelings_table.tableName,
      },
    });
    feelingIdDeleteLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    feelings_table.grantReadWriteData(feelingIdDeleteLambda);
    

 
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
