import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export function createIngredientsTable(stack: cdk.Stack): dynamodb.Table {
  return new dynamodb.Table(stack, "ingredients-table", {
    partitionKey: {
      name: "ingredients-id",
      type: dynamodb.AttributeType.STRING,
    },
    tableName: "ingredients",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
}
