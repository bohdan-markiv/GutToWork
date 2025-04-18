import boto3
import json
import logging
import uuid
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)



def handler(event, context):
    feeling_id = str(uuid.uuid4())
    event = json.loads(event['body'])
    logger.info(event)
    
    try:
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        dynamodb.put_item(
            TableName='feelings',
            Item={
                "feeling-id": {"S": feeling_id},
                "feeling_score": {"N": str(event["feeling_score"])},
                "stress_level": {"N": str(event["stress_level"])},
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
        'body': json.dumps({"feeling_id": feeling_id})
    }