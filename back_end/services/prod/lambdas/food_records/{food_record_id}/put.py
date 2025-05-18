import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
table = dynamodb.Table('food_records')


def handler(event, context):
    logger.info(f"Received event: {event}")

    food_record_id = event["pathParameters"]["food_record_id"]
    body = json.loads(event["body"])

    record_date = body.get("record_date")
    time_of_day = body.get("time_of_day")
    # This will map to 'ingredients_json' in the DB
    ingredients = body.get("ingredients")

    update_clauses = []
    expr_vals = {}

    update_clauses.append("record_date = :d")
    expr_vals[":d"] = record_date

    update_clauses.append("time_of_day = :t")
    expr_vals[":t"] = time_of_day

    update_clauses.append("ingredients_json = :ing")
    expr_vals[":ing"] = json.dumps(ingredients)

    if not update_clauses:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": "No valid fields to update."})
        }

    update_expression = "SET " + ", ".join(update_clauses)

    try:
        response = table.update_item(
            Key={'food-record-id': food_record_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expr_vals,
            ReturnValues="UPDATED_NEW"
        )

        logger.info(f"Updated attributes: {response.get('Attributes')}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "message": "Update successful",
                "updatedAttributes": response.get('Attributes')
            })
        }

    except Exception as e:
        logger.error("Error updating item", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({"error": str(e)})
        }
