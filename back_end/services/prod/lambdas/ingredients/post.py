import boto3
import json
import logging
import uuid
import re


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def normalize_name(name):
    """Normalize the ingredient name by removing spaces, hyphens, and underscores to avoid duplicates later"""
    return re.sub(r'[\s\-_]+', '',name)


def handler(event, context):

    ingredient_id = str(uuid.uuid4())
    event_body = json.loads(event['body'])
    logger.info(event)

    #make new ingredient lowercase and normalize it to avoid duplicates
    ingredient_name = event_body["ingredient_name"].strip().lower() 
    normalized_name = normalize_name(ingredient_name)

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
        response = dynamodb.scan(TableName='ingredients')     # Fetch all existing ingredients

        for item in response.get('Items', []): #normalize existing names
            existing_name = item.get("ingredient_name", {}).get("S", "").strip().lower() 
            existing_normalized = normalize_name(existing_name)

            # Exact Match Check
            if existing_normalized == normalized_name:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': f"Ingredient '{event_body['ingredient_name']}' is too similar to an existing entry '{existing_name}'"
                }

            # Partial Match Check 
            if existing_normalized.startswith(normalized_name) or normalized_name.startswith(existing_normalized):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': f"Ingredient '{event_body['ingredient_name']}' is too similar to an existing entry '{existing_name}'."
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