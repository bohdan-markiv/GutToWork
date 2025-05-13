import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def parse_dynamo_data(data):
    return [{k: v["S"] for k, v in item.items()} for item in data]


def handler(event, context):
    logger.info(event)

    food_record_id = event["pathParameters"]["food_record_id"]

    try:
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Use get_item instead of scan (requires 'food-record-id' as the partition key)
        response = dynamodb.get_item(
            TableName='food_records',
            Key={
                'food-record-id': {'S': food_record_id}
            }
        )

        item = response.get('Item')

        parsed_item = parse_dynamo_data([item])[0]
        if not item:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f"No item found for ingredient-id '{food_record_id}'"})
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(parsed_item)
        }

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
