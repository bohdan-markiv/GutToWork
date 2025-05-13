import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export function createFeelingsTable(stack: cdk.Stack): dynamodb.Table {
  return new dynamodb.Table(stack, "feelings-table", {
    partitionKey: { name: "feeling-id", type: dynamodb.AttributeType.STRING },
    tableName: "feelings",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
}
