import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def parse_dynamo_data(data):
    parsed = []
    for item in data:
        parsed_item = {}
        for k, v in item.items():
            # Get the first key (e.g., 'S' or 'N') and its value
            dtype, val = next(iter(v.items()))
            # Convert 'N' values to int or float
            if dtype == "N":
                parsed_item[k] = int(val) if val.isdigit() else float(val)
            else:
                parsed_item[k] = val
        parsed.append(parsed_item)
    return parsed



def handler(event, context):
    # Create a DynamoDB resource
    try:

        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Scan the table to get all items
        response = dynamodb.scan(TableName='poop')
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
            'body': "No poop records found"
        }
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(parsed_items)
    }
