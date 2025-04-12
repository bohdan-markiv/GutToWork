import boto3
import json
import logging
import uuid
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
    feeling_id = str(uuid.uuid4())
    event = json.loads(event['body'])
    logger.info(event)

    # ✅ Check required fields
    required_fields = ["time_of_day", "feeling_score", "feeling_date"]
    for field in required_fields:
        if field not in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f"Missing required field: {field}"})
            }

    # ✅ Validate poop_date format (expecting YYYY-MM-DD)
    if not is_valid_date(event["feeling_date"]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': "Invalid feeling_date format. Expected YYYY-MM-DD"})
        }

    # ✅ Validate score is an integer between 1 and 5
    if not isinstance(event["feeling_score"], int) or not (1 <= event["feeling_score"] <= 10):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': "Invalid score. Must be an integer between 1 and 10."})
        }
    
    try:
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        dynamodb.put_item(
            TableName='feelings',
            Item={
                "feeling-id": {"S": feeling_id},
                "time_of_day": {"S": event["time_of_day"]},
                "feeling_score": {"N": str(event["feeling_score"])},
                "feeling_date": {"S": event["feeling_date"]}
            }
        )
    except Exception as e:
        logger.error(f"Error writing to DynamoDB: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error - {e}"
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': f"New feeling record - {feeling_id}"
    }