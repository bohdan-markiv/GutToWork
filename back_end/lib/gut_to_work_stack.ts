import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createIngredientsLambdas } from "./ingredients/Lambda";
import { createFoodRecordsLambdas } from "./food_records/Lambda";
import { createPoopLambdas } from "./poop/Lambda";
import { createIngredientsTable } from "./ingredients/Table";
import { createFoodRecordsTable } from "./food_records/Table";
import { createPoopTable } from "./poop/Table";
export class GutToWork extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the DynamoDB table
    const ingredientsTable = createIngredientsTable(this);
    const foodRecordsTable = createFoodRecordsTable(this);
    const poopTable = createPoopTable(this);

    // Import the OpenAPI spec
    const openApiSpecProd = apigateway.AssetApiDefinition.fromAsset(
      "./services/prod/api.yaml"
    );

    // Create the API Gateway REST API using the spec
    const apiProd = new apigateway.SpecRestApi(this, "guttowork-api", {
      apiDefinition: openApiSpecProd,
    });

    // Create all ingredients Lambdas
    const ingredientsLambdas = createIngredientsLambdas(this, ingredientsTable);

    const foodLambdas = createFoodRecordsLambdas(this, foodRecordsTable);
    const poopLambdas = createPoopLambdas(this, foodRecordsTable);

    // Optionally, you can access individual Lambdas:
    // ingredientsLambdas.get, ingredientsLambdas.post, etc.

    // Output the API Gateway endpoint URL
    new cdk.CfnOutput(this, "ApiProdEndpoint", {
      value: `https://${apiProd.restApiId}.execute-api.${this.region}.amazonaws.com/`,
      description: "The URL of the API Gateway endpoint",
    });
  }
}

const app = new cdk.App();
new GutToWork(app, "ApiGatewayLambdaExample");
