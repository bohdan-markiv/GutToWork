import boto3
import json
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Helper function to convert DynamoDB item format to plain Python dict
def parse_dynamo_data(data):
    return [{k: int(v["N"]) if "N" in v else v["S"] for k, v in item.items()} for item in data]


def handler(event, context):
    logger.info(event)  # Log the incoming event

    # Extract the feeling ID from path parameters
    feeling_id = event["pathParameters"]["feeling_id"]

    try:
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Fetch item by primary key
        response = dynamodb.get_item(
            TableName='feelings',
            Key={
                'feeling-id': {'S': feeling_id}
            }
        )

        item = response.get('Item')

        # If no item is found, return 404
        if not item:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f"No item found for feeling-id '{feeling_id}'"})
            }

        # Parse and return the item in a simplified format
        parsed_item = parse_dynamo_data([item])[0]

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
        # Return internal server error if something goes wrong
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"message": f"Unexpected error - {str(e)}"})
        }
