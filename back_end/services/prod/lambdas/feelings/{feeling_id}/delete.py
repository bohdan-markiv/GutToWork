import boto3
import json
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info(f"Received event: {event}")  # Log the incoming event

    try:
        # Extract the feeling ID from the URL path parameters
        feeling_id = event["pathParameters"]["feeling_id"]

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Delete the item in the 'feelings' table with the specified ID
        response = dynamodb.delete_item(
            TableName='feelings',
            Key={'feeling-id': {'S': feeling_id}}
        )

        logger.info(f"DeleteItem response: {response}")  # Log delete response

        # Return success message
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "feeling_id": feeling_id
            })
        }
    

    except Exception as e:
        # Handle errors during deletion
        logger.error(f"Error deleting item: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": str(e)})
        }
