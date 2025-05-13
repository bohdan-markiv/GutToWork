import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        food_record_id = event["pathParameters"]["food_record_id"]

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Delete the item with the matching key

        response = dynamodb.delete_item(
            TableName='food_records',
            Key={'food-record-id': {'S': food_record_id}}
        )

        logger.info(f"DeleteItem response: {response}")

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'ingredient_id': food_record_id})
        }

    except Exception as e:
        logger.error(f"Error deleting item: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": str(e)})
        }
