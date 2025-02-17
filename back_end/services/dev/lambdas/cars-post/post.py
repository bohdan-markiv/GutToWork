import boto3
import json
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    license_plate = str(uuid.uuid4())
    event = json.loads(event['body'])
    logger.info(event)

    try:

        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        dynamodb.put_item(TableName='cars-cdk',
                          Item={
                              "car-id": {
                                  "S": license_plate
                              },
                              "brand": {
                                  "S": event["brand"]
                              },
                              "model": {
                                  "S": event["model"]
                              }
                          })
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
        'body': f"New license plate - {license_plate}"
    }
