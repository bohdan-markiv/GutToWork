import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info(f"Received event: {event}")

    try:
        # Parse the food_record_id from path parameters
        food_record_id = event["pathParameters"]["food_record_id"]

        # Parse the request body (API Gateway sends it as a JSON string)
        body = json.loads(event["body"])
        inserted_date = body.get("record_date")
        ingredient_id = body.get("ingredient_id")
        ingredient_name = body.get("ingredient_name")
        portion_size = body.get("portion_size")
        cooking_type = body.get("cooking_type")
        time_of_day = body.get("time_of_day")

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb', region_name='eu-central-1')

        # Build update expression and expression attribute values
        update_expressions = []
        expression_values = {}

        update_expressions.append("record_date = :d")
        expression_values[":d"] = {'S': inserted_date}

        update_expressions.append("ingredient_id = :i")
        expression_values[":i"] = {'S': ingredient_id}

        update_expressions.append("ingredient_name = :n")
        expression_values[":n"] = {'S': ingredient_name}

        update_expressions.append("portion_size = :p")
        expression_values[":p"] = {'S': portion_size}

        update_expressions.append("cooking_type = :c")
        expression_values[":c"] = {'S': cooking_type}

        update_expressions.append("time_of_day = :t")
        expression_values[":t"] = {'S': time_of_day}

        if not update_expressions:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({"error": "No valid fields to update."})
            }

        update_expression = "SET " + ", ".join(update_expressions)

        # Perform the update
        response = dynamodb.update_item(
            TableName='food_records',
            Key={'food-record-id': {'S': food_record_id}},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ReturnValues="UPDATED_NEW"
        )

        logger.info(f"Updated attributes: {response['Attributes']}")

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "message": "Update was successful",
                "updatedAttributes": response['Attributes']
            })
        }

    except Exception as e:
        logger.error(f"Error updating item: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": str(e)})
        }
