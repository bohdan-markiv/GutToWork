
import boto3
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        feeling_id = event["pathParameters"]["feeling_id"]
        body = json.loads(event["body"])

        
        feeling_score = body.get("feeling_score")
        stress_level = body.get("stress_level")
        feeling_date = body.get("feeling_date")

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        
        # Build the update expression dynamically
        update_expression = "SET feeling_score = :m, stress_level = :m, feeling_date = :l"
        expression_values = {
            ":m": {'N': str(feeling_score)},
            ":m": {'N': str(stress_level)},
            ":l": {'S': feeling_date}
        }

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