import boto3
import json
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.client('dynamodb', region_name='eu-central-1')


def handler(event, context):
    # Parse body
    try:
        body = json.loads(event.get('body', '{}'))
        record_date = body['record_date']
        time_of_day = body['time_of_day']
        ingredients = body['ingredients']
        if not isinstance(ingredients, list):
            raise ValueError("`ingredients` must be a list")
    except (KeyError, ValueError) as e:
        logger.error("Bad request: %s", e)
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

    # Build item
    food_record_id = str(uuid.uuid4())
    item = {
        'food-record-id': {'S': food_record_id},
        'record_date':    {'S': record_date},
        'time_of_day':    {'S': time_of_day},
        # Store ingredients array as a JSON string
        'ingredients_json': {'S': json.dumps(ingredients)}
    }

    # Write to DynamoDB
    try:
        dynamodb.put_item(
            TableName='food_records',
            Item=item
        )
    except Exception:
        logger.exception("Failed to write to DynamoDB")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }

    # Return the new record ID
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'food-record-id': food_record_id})
    }
