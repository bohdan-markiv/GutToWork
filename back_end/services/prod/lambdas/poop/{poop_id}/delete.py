import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        # Parse the registration ID from the path parameters
        poop_id = event["pathParameters"]["poop_id"]

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Delete the item with the matching key

        response = dynamodb.delete_item(
            TableName='poop',
            Key={'poop-id': {'S': poop_id}}
        )

        logger.info(f"DeleteItem response: {response}")

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': f"Item with poop_id '{poop_id}' was deleted successfully"
            })
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
