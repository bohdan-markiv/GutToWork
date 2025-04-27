import boto3
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        poop_id = event["pathParameters"]["poop_id"]
        body = json.loads(event["body"])

        time_of_day = body["time_of_day"]
        score = body["score"]
        poop_date = body["poop_date"]

        
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build the update expression dynamically
        update_expression = "SET time_of_day = :n, score = :m, poop_date = :l"
        expression_values = {
            ":n": {'S': time_of_day},
            ":m": {'N': str(score)},
            ":l": {'S': poop_date}
        }

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
            'body': json.dumps(response['Attributes'])  
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
