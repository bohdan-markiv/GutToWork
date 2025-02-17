import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(event)

    license_plate = event["pathParameters"]["registrationId"]

    try:
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Use get_item instead of scan (requires 'car-id' is the partition key)
        response = dynamodb.get_item(
            TableName='cars-cdk',
            Key={
                'car-id': {'S': license_plate}
            }
        )

        item = response.get('Item')
        if not item:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f"No item found for license plate '{license_plate}'"})
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(item)
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
