import boto3
import json
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        # Parse the registration ID from the path parameters
        ingredient_id = event["pathParameters"]["ingredient_id"]

        # Parse the request body (API Gateway sends it as a JSON string)
        body = json.loads(event["body"])
        ingredient_name = body.get("ingredient_name")
        ingredient_def_portion = body.get("default_portion_size")
        ingredient_def_cook_type = body.get("default_cooking_type", None)

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build the update expression dynamically
        update_expressions = []
        expression_values = {}

        if ingredient_name:
            update_expressions.append("ingredient_name = :n")
            expression_values[":n"] = {'S': ingredient_name}
        if ingredient_def_portion:
            update_expressions.append("default_portion_size = :m")
            expression_values[":m"] = {'S': ingredient_def_portion}
        if ingredient_def_cook_type is not None:
            update_expressions.append("default_cooking_type = :l")
            expression_values[":l"] = {'S': ingredient_def_cook_type}

        update_expression = "SET " + ", ".join(update_expressions)

        # Perform the update
        response = dynamodb.update_item(
            TableName='ingredients',
            Key={'ingredients-id': {'S': ingredient_id}},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ReturnValues="UPDATED_NEW"
        )

        logger.info(f"Updated attributes: {response['Attributes']}")

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': "Update was successful" + json.dumps(response['Attributes'])
        }

    except Exception as e:
        logger.error(f"Error updating item: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": str(e)})
        }
