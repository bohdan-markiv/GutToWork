import json
import boto3
import os
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Helper function to convert raw DynamoDB types into standard Python data
def parse_dynamo_data(data):
    return [{k: int(v["N"]) if "N" in v else v["S"] for k, v in item.items()} for item in data]


# Lambda entry point
def handler(event, context):
    try:
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Scan the entire 'feelings' table
        response = dynamodb.scan(TableName='feelings')
    except Exception as e:
        # Handle errors during scan
        logger.error(f"Scan error - {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error - {e}"
        }

    try:
        logger.info(response)
        items = response.get('Items', [])
        parsed_items = parse_dynamo_data(items)  # Convert raw data to Python types
    except Exception as e:
        # Handle errors during parsing
        logger.error(f"Parsing error - {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error - {e}"
        }

    if not items:
        # No data found in table
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': "No feeling records found"
        }

    # Return parsed data as JSON
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(parsed_items)
    }
