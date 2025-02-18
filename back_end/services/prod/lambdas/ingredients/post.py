import boto3
import json
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    ingredient_id = str(uuid.uuid4())
    event_body = json.loads(event['body'])
    logger.info(event)

    try:
        item = {
                              "ingredients-id": {
                                  "S": ingredient_id
                              },
                              "ingredient_name": {
                                  "S": event_body["ingredient_name"]
                              },
                              "default_portion_size": {
                                  "S": event_body["default_portion_size"]
                              }
                          }
        if "default_cooking_type" in event_body:
            item["default_cooking_type"] = {"S": event_body["default_cooking_type"]}
    except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': f"Internal error occured - {e}"
            }

    try:

        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        dynamodb.put_item(TableName='ingredients',
                          Item=item)
    except Exception as e:
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
        'body': f"New ingredient - {ingredient_id}"
    }
