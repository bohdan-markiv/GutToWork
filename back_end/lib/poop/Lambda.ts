import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface PoopLambdas {
  poopGetLambda: lambda.Function;
  poopPostLambda: lambda.Function;
  poopIdGetLambda: lambda.Function;
  poopIdPutLambda: lambda.Function;
  poopIdDeleteLambda: lambda.Function;
}

export function createPoopLambdas(
  scope: Construct,
  table: dynamodb.Table
): PoopLambdas {
  // Poop-get Lambda
  const poopGetLambda = new lambda.Function(scope, "poop-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "poop-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/poop`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  poopGetLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(poopGetLambda);

  // Poop-post Lambda
  const poopPostLambda = new lambda.Function(scope, "poop-post", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "poop-post",
    handler: "post.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/poop`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  poopPostLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(poopPostLambda);

  // poopID-get
  const poopIdGetLambda = new lambda.Function(scope, "poop-id-get", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "poop-id-get",
    handler: "get.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/poop/{poop_id}`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  poopIdGetLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(poopIdGetLambda);

  // poop-id-put Lambda
  const poopIdPutLambda = new lambda.Function(scope, "poop-id-put", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "poop-id-put",
    handler: "put.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/poop/{poop_id}`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  poopIdPutLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(poopIdPutLambda);

  // poopId-delete
  const poopIdDeleteLambda = new lambda.Function(scope, "poop-id-delete", {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: "poop-id-delete",
    handler: "delete.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, `../../services/prod/lambdas/poop/{poop_id}`)
    ),
    environment: {
      DYNAMO_TABLE_NAME: table.tableName,
    },
  });
  poopIdDeleteLambda.grantInvoke(
    new iam.ServicePrincipal("apigateway.amazonaws.com")
  );
  table.grantReadWriteData(poopIdDeleteLambda);

  return {
    poopGetLambda,
    poopPostLambda,
    poopIdGetLambda,
    poopIdPutLambda,
    poopIdDeleteLambda,
  };
}
