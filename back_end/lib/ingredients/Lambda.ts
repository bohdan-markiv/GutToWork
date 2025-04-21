import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface IngredientsLambdas {
  ingredientsGet: lambda.Function;
  ingredientsPost: lambda.Function;
  ingredientsIdGet: lambda.Function;
  ingredientsIdPut: lambda.Function;
  ingredientsIdDelete: lambda.Function;
}

export function createIngredientsLambdas(
  scope: Construct,
  table: dynamodb.Table
): IngredientsLambdas {
  // ingredients-get Lambda
  const ingredientsGet = new lambda.Function(scope, "ingredients-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "ingredients-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/ingredients`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  ingredientsGet.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(ingredientsGet);

  // ingredients-post Lambda
  const ingredientsPost = new lambda.Function(scope, "ingredients-post", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "ingredients-post",
    handler: "post.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/ingredients`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  ingredientsPost.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(ingredientsPost);

  // ingredient-id-get Lambda
  const ingredientsIdGet = new lambda.Function(scope, "ingredient-id-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "ingredient-id-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(
        __dirname,
        `../../services/prod/lambdas/ingredients/{ingredient_id}`
      )
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  ingredientsIdGet.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(ingredientsIdGet);

  // ingredient-id-put Lambda
  const ingredientsIdPut = new lambda.Function(scope, "ingredient-id-put", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "ingredient-id-put",
    handler: "put.handler",
    code: lambda.Code.fromAsset(
      path.join(
        __dirname,
        `../../services/prod/lambdas/ingredients/{ingredient_id}`
      )
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  ingredientsIdPut.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(ingredientsIdPut);

  // ingredient-id-delete Lambda
  const ingredientsIdDelete = new lambda.Function(
    scope,
    "ingredient-id-delete",
    {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: "ingredient-id-delete",
      handler: "delete.handler",
      code: lambda.Code.fromAsset(
        path.join(
          __dirname,
          `../../services/prod/lambdas/ingredients/{ingredient_id}`
        )
      ),
      environment: {
        DYNAMO_TABLE_NAME: table.tableName,
      },
    }
  );
  ingredientsIdDelete.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(ingredientsIdDelete);

  return {
    ingredientsGet,
    ingredientsPost,
    ingredientsIdGet,
    ingredientsIdPut,
    ingredientsIdDelete,
  };
}
