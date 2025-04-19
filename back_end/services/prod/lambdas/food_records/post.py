import boto3
import json
import logging
import uuid
import re


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    food_record_id = str(uuid.uuid4())
    event_body = json.loads(event['body'])
    logger.info(event)

    dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

    try:
        item = {
            "food-record-id": {
                "S": food_record_id
            },
            "record_date": {
                "S": event_body["record_date"]
            },
            "ingredient_id": {
                "S": event_body["ingredient_id"]
            },
            "ingredient_name": {
                "S": event_body["ingredient_name"]
            },
            "portion_size": {
                "S": event_body["portion_size"]
            },
            "cooking_type": {
                "S": event_body["cooking_type"]
            },
            "time_of_day": {
                "S": event_body["time_of_day"]
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Internal error occurred - {e}"
        }

    try:
        dynamodb.put_item(TableName='food_records', Item=item)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error while inserting item - {e}"
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'food_record_id': food_record_id})
    }
