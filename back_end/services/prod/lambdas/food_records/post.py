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
    inserted_records = []

    dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
    for food_record in event_body:
        food_record_id = str(uuid.uuid4())
        try:
            item = {
                "food-record-id": {
                    "S": food_record_id
                },
                "record_date": {
                    "S": food_record["record_date"]
                },
                "ingredient_id": {
                    "S": food_record["ingredient_id"]
                },
                "ingredient_name": {
                    "S": food_record["ingredient_name"]
                },
                "portion_size": {
                    "S": food_record["portion_size"]
                },
                "cooking_type": {
                    "S": food_record["cooking_type"]
                },
                "time_of_day": {
                    "S": food_record["time_of_day"]
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
            inserted_records.append(food_record_id)
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
        'body': json.dumps({'inserted_records': inserted_records})
    }
