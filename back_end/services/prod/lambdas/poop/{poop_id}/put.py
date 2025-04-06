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
        poop_id = event["pathParameters"]["poop_id"]
        body = json.loads(event["body"])

        time_of_day = body.get("time_of_day")
        score = body.get("score")
        poop_date = body.get("poop_date")

        # Validate inputs
        if poop_date and not is_valid_date(poop_date):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': "Invalid poop_date format. Expected YYYY-MM-DD"})
            }

        if score is not None:
            if not isinstance(score, int) or not (1 <= score <= 5):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': "Invalid score. Must be an integer between 1 and 5."})
                }

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build the update expression dynamically
        update_expressions = []
        expression_values = {}

        if time_of_day:
            update_expressions.append("time_of_day = :n")
            expression_values[":n"] = {'S': time_of_day}
        if score is not None:
            update_expressions.append("score = :m")
            expression_values[":m"] = {'N': str(score)}
        if poop_date:
            update_expressions.append("poop_date = :l")
            expression_values[":l"] = {'S': poop_date}

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
            TableName='poop',
            Key={'poop-id': {'S': poop_id}},
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
