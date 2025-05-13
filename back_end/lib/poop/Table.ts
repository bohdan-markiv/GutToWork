import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export function createPoopTable(stack: cdk.Stack): dynamodb.Table {
  return new dynamodb.Table(stack, "poop-table", {
    partitionKey: { name: "poop-id", type: dynamodb.AttributeType.STRING },
    tableName: "poop",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
}
