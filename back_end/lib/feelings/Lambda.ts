import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface FeelingsLambdas {
  feelingsGetLambda: lambda.Function;
  feelingsPostLambda: lambda.Function;
  feelingsIdGetLambda: lambda.Function;
  feelingsIdPutLambda: lambda.Function;
  feelingsIdDeleteLambda: lambda.Function;
}

export function createFeelingsLambdas(
  scope: Construct,
  table: dynamodb.Table
): FeelingsLambdas {
  // Poop-get Lambda
  const feelingsGetLambda = new lambda.Function(scope, "feelings-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "feelings-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../services/prod/lambdas/feelings`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  feelingsGetLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(feelingsGetLambda);

  // Poop-post Lambda
  const feelingsPostLambda = new lambda.Function(scope, "feelings-post", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "feelings-post",
    handler: "post.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../services/prod/lambdas/feelings`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  feelingsPostLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(feelingsPostLambda);

  // feelingsID-get
  const feelingsIdGetLambda = new lambda.Function(scope, "feelings-id-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "feelings-id-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../services/prod/lambdas/feelings/{feelings_id}`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  feelingsIdGetLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(feelingsIdGetLambda);

  // feelings-id-put Lambda
  const feelingsIdPutLambda = new lambda.Function(scope, "feelings-id-put", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "feelings-id-put",
    handler: "put.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../services/prod/lambdas/feelings/{feelings_id}`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  feelingsIdPutLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(feelingsIdPutLambda);

  // feelingsId-delete
  const feelingsIdDeleteLambda = new lambda.Function(
    scope,
    "feelings-id-delete",
    {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: "feelings-id-delete",
      handler: "delete.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, `../services/prod/lambdas/feelings/{feelings_id}`)
      ),
      environment: {
        DYNAMO_TABLE_NAME: table.tableName,
      },
    }
  );
  feelingsIdDeleteLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(feelingsIdDeleteLambda);

  return {
    feelingsGetLambda,
    feelingsPostLambda,
    feelingsIdGetLambda,
    feelingsIdPutLambda,
    feelingsIdDeleteLambda,
  };
}
