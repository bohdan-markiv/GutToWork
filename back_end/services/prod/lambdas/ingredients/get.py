import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def parse_dynamo_data(data):
    return [{k: v["S"] for k, v in item.items()} for item in data]


def handler(event, context):
    # Create a DynamoDB resource
    try:

        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Scan the table to get all items
        response = dynamodb.scan(TableName='ingredients')
    except Exception as e:
        logger.error(f"error - {e}", exc_info=True)
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
        parsed_items = parse_dynamo_data(items)
    except Exception as e:
        logger.error(f"error - {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error - {e}"
        }

    if not items:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': "No ingredients found"
        }
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(parsed_items)
    }
