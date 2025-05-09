import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export function createFoodRecordsTable(stack: cdk.Stack): dynamodb.Table {
  return new dynamodb.Table(stack, "food-records-table", {
    partitionKey: {
      name: "food-record-id",
      type: dynamodb.AttributeType.STRING,
    },
    tableName: "food_records",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
}
