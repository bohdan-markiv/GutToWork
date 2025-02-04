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
        license_plate = event["pathParameters"]["registrationId"]

        # Parse the request body (API Gateway sends it as a JSON string)
        body = json.loads(event["body"])
        brand = body.get("brand")
        model = body.get("model")

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build the update expression dynamically
        update_expressions = []
        expression_values = {}

        if brand:
            update_expressions.append("brand = :b")
            expression_values[":b"] = {'S': brand}
        if model:
            update_expressions.append("model = :m")
            expression_values[":m"] = {'S': model}

        update_expression = "SET " + ", ".join(update_expressions)

        # Perform the update
        response = dynamodb.update_item(
            TableName='cars-cdk',
            Key={'car-id': {'S': license_plate}},
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
