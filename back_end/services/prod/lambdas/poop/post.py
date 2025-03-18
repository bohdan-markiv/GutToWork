import boto3
import json
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    poop_id = str(uuid.uuid4())
    event = json.loads(event['body'])
    logger.info(event)

    try:

        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')
        dynamodb.put_item(TableName='poop',
                          Item={
                              "poop-id": {
                                  "S": poop_id
                              },
                              "time_of_day": {
                                  "S": event["time_of_day"]
                              },
                              "score": {
                                  "S": event["score"]
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
        'body': f"New poop record - {poop_id}"
    }
