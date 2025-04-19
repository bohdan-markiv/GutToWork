import boto3
import json
import logging
import uuid
from datetime import datetime

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Lambda entry point
def handler(event, context):
    feeling_id = str(uuid.uuid4())  # Generate a unique ID for the new record
    event = json.loads(event['body'])  # Parse the incoming JSON body
    logger.info(event)  # Log the input data
    
    try:
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        
        # Insert new record into the 'feelings' table
        dynamodb.put_item(
            TableName='feelings',
            Item={
                "feeling-id": {"S": feeling_id},  # Primary key
                "feeling_score": {"N": str(event["feeling_score"])},  # Score 1–10
                "stress_level": {"N": str(event["stress_level"])},    # Stress 1–10
                "feeling_date": {"S": event["feeling_date"]}          # Date string
            }
        )
    except Exception as e:
        # Handle DB write errors
        logger.error(f"Error writing to DynamoDB: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error - {e}"
        }

    # Return success and the new record's ID
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({"feeling_id": feeling_id})
    }
