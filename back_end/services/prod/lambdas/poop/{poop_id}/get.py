import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def parse_dynamo_data(data):
    parsed = []
    for item in data:
        parsed_item = {}
        for k, v in item.items():
            # Get the first key (e.g., 'S' or 'N') and its value
            dtype, val = next(iter(v.items()))
            # Convert 'N' values to int or float
            if dtype == "N":
                parsed_item[k] = int(val) if val.isdigit() else float(val)
            else:
                parsed_item[k] = val
        parsed.append(parsed_item)
    return parsed


def handler(event, context):
    logger.info(event)

    poop_id = event["pathParameters"]["poop_id"]

    try:
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        response = dynamodb.get_item(
            TableName='poop',
            Key={
                'poop-id': {'S': poop_id}
            }
        )

        item = response.get('Item')

        # If no item was found
        if not item:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f"No item found for poop-id '{poop_id}'"})
            }

        # Parse and return the item
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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"message": f"Unexpected error - {str(e)}"})
        }
