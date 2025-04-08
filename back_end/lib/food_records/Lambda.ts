import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface FoodRecordsLambdas {
  foodRecordsGet: lambda.Function;
  foodRecordsPost: lambda.Function;
  foodRecordIdGet: lambda.Function;
  foodRecordIdPut: lambda.Function;
  foodRecordIdDelete: lambda.Function;
}

export function createFoodRecordsLambdas(
  scope: Construct,
  table: dynamodb.Table
): FoodRecordsLambdas {
  // ingredients-get Lambda
  const foodRecordsGet = new lambda.Function(scope, "food-records-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "food-records-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/food_records`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  foodRecordsGet.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(foodRecordsGet);

  // ingredients-post Lambda
  const foodRecordsPost = new lambda.Function(scope, "food-record-post", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "food-record-post",
    handler: "post.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/food_records`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  foodRecordsPost.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(foodRecordsPost);

  // food-record-id-get Lambda
  const foodRecordIdGet = new lambda.Function(scope, "food-record-id-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "food-record-id-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(
        __dirname,
        `../../services/prod/lambdas/food_records/{food_record_id}`
      )
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  foodRecordIdGet.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(foodRecordIdGet);

  // ingredient-id-put Lambda
  const foodRecordIdPut = new lambda.Function(scope, "food-record-id-put", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "food-record-id-put",
    handler: "put.handler",
    code: lambda.Code.fromAsset(
      path.join(
        __dirname,
        `../../services/prod/lambdas/food_records/{food_record_id}`
      )
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  foodRecordIdPut.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(foodRecordIdPut);

  const foodRecordIdDelete = new lambda.Function(
    scope,
    "food-record-id-delete",
    {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: "food-record-id-delete",
      handler: "delete.handler",
      code: lambda.Code.fromAsset(
        path.join(
          __dirname,
          `../../services/prod/lambdas/food_records/{food_record_id}`
        )
      ),
      environment: {
        DYNAMO_TABLE_NAME: table.tableName,
      },
    }
  );
  foodRecordIdDelete.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(foodRecordIdDelete);
  return {
    foodRecordsGet,
    foodRecordsPost,
    foodRecordIdGet,
    foodRecordIdPut,
    foodRecordIdDelete,
  };
}
