
import boto3
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def is_valid_date(date_str):
    try:
        # Expecting format: YYYY-MM-DD
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        feeling_id = event["pathParameters"]["feeling_id"]
        body = json.loads(event["body"])

        time_of_day = body.get("time_of_day")
        feeling_score = body.get("feeling_score")
        feeling_date = body.get("feeling_date")

        # Validate inputs
        if feeling_date and not is_valid_date(feeling_date):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': "Invalid feeling_date format. Expected YYYY-MM-DD"})
            }

        if feeling_score is not None:
            if not isinstance(feeling_score, int) or not (1 <= feeling_score <= 10):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': "Invalid score. Must be an integer between 1 and 10."})
                }

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build the update expression dynamically
        update_expressions = []
        expression_values = {}

        if time_of_day:
            update_expressions.append("time_of_day = :n")
            expression_values[":n"] = {'S': time_of_day}
        if feeling_score is not None:
            update_expressions.append("feeling_score = :m")
            expression_values[":m"] = {'N': str(feeling_score)}
        if feeling_date:
            update_expressions.append("feeling_date = :l")
            expression_values[":l"] = {'S': feeling_date}

        if not update_expressions:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': "No valid fields provided for update."})
            }

        update_expression = "SET " + ", ".join(update_expressions)

        # Perform the update
        response = dynamodb.update_item(
            TableName='feelings',
            Key={'feeling-id': {'S': feeling_id}},
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
            'body': json.dumps({"message": "Update was successful"})
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
