import boto3
import json
import logging
import uuid


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    ingredient_id = str(uuid.uuid4())
    event_body = json.loads(event['body'])
    logger.info(event)

    ingredient_name = event_body["ingredient_name"].strip().lower()

    try:
        item = {
                              "ingredients-id": {
                                  "S": ingredient_id
                              },
                              "ingredient_name": {
                                  "S": ingredient_name
                              },
                              "default_portion_size": {
                                  "S": event_body["default_portion_size"]
                              }
                          }
        if "default_cooking_type" in event_body:
            item["default_cooking_type"] = {"S": event_body["default_cooking_type"]}
    except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': f"Internal error occured - {e}"
            }

    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

    # Check if the ingredient_name already exists in the table
    try:
        response = dynamodb.scan(
            TableName='ingredients',
            FilterExpression="begins_with(ingredient_name, :ingredient_name) OR contains(ingredient_name, :ingredient_name) OR begins_with(:ingredient_name, ingredient_name) OR contains(:ingredient_name, ingredient_name)",
            ExpressionAttributeValues={
                ":ingredient_name": {"S": ingredient_name}
            }
        )

        if 'Items' in response and len(response['Items']) > 0:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': f"Ingredient with name '{event_body['ingredient_name']}' already exists."
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Error checking for duplicate ingredient name - {e}"
        }

    # If no duplicate, insert the new item into DynamoDB
    try:
        dynamodb.put_item(TableName='ingredients', Item=item)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f"Unexpected error while inserting item - {e}"
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': f"New ingredient created with ID: {ingredient_id}"
    }