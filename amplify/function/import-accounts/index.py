import boto3
import pandas as pd
import numpy as np

import uuid  # Import the uuid module
import os  # Import the os module to access environment variables
import json
from datetime import datetime  # For adding timestamp attribute
import io  # For handling in-memory byte data
from utils import convert_column_to_isoformat, convert_column_to_number, is_mobile_number, communication_preferences  # Import the utility functions
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Retrieve the DynamoDB user_table name from environment variables
user_table_name = os.environ.get('USER_TABLE_NAME')
if not user_table_name:
    raise ValueError("USER_TABLE_NAME environment variable is not set")

account_table_name = os.environ.get('ACCOUNT_TABLE_NAME')
if not account_table_name:
    raise ValueError("ACCOUNT_TABLE_NAME environment variable is not set")


# Initialize the DynamoDB user_table object
user_table = dynamodb.Table(user_table_name)
account_table = dynamodb.Table(account_table_name)

# Initialize S3 client
s3_client = boto3.client('s3')

# Fixed attributes to be added to every user
fixed_attributes_user = {
    'status': 'Pending',  # fixed attribute
    'role': 'Employee',  #  fixed attribute
    'settings': {'notifications': True, 'hasLogin': False, 'theme': 'light'},  # fixed attribute
    '__typename': 'UserProfile',  # fixed attribute
}

# Define a mapping between CSV columns and DynamoDB attribute names
column_mapping_account = {
    'Number': 'number',
    'Address Line 1': 'addressLine1',
    'Address Line 2': 'addressLine2',
    'Balance': 'balance',
    'City': 'city',
    'Created': 'createdAt',
    'Email': 'email',
    'First Name': 'firstName',
    'Last Activity': 'lastActivityAt',
    'Last Item Entered': 'lastItemAt',
    'Last Name': 'lastName',
    'Last Settlement': 'lastSettlementAt',
    'Number Of Items': 'noItems',
    'Number Of Sales': 'noSales',
    'Phone': 'phoneNumber',
    'Zip': 'postcode',
    'State': 'state',
    'Deactivated': 'deletedAt',
}

# Fixed attributes to be added to every account
fixed_attributes_account = {
    'status': 'Active',  # fixed attribute
    'kind': 'Standard',  #  fixed attribute
    'defaultSplit': 30, 
    '__typename': 'Account',  # fixed attribute
}

def handler(event, context):
    # Extract the S3 bucket name and object key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']
    
    # Get the file from S3
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        csv_content = response['Body'].read()
    except Exception as e:
        return {'statusCode': 500, 'body': f'Error retrieving file from S3: {str(e)}'}
    
    # Read CSV with pandas
    try:
        df = pd.read_csv(io.BytesIO(csv_content), converters={'Number': str})
        logger.info(f'Successfully found {len(df)} unique items from CSV file.')
        df = df.replace({np.nan: None})  # Replace NaN with None

    except Exception as e:
        return {'statusCode': 500, 'body': f'Error reading CSV file: {str(e)}'}
    
    # Remove duplicates based on the 'Created By' column
    # df = df.drop_duplicates(subset='Created By', keep='first')  # Keep the first occurrence
    # Convert date column to ISO format
    date_columns = ['Created', 'Deactivated', 'Last Activity', 'Last Settlement', 'Last Item Entered']
    for col in date_columns:
        df = convert_column_to_isoformat(df, col)
    
    # Convert number columns to numeric format
    number_columns = ['Balance', 'Number Of Items', 'Number Of Sales']
    for col in number_columns:
        df = convert_column_to_number(df, col)

    # Write each row to DynamoDB with a UUID and fixed attributes
    for _, row in df.iterrows():
  
        
        # Query the secondary index for the 'nickname' to check if the item already exists
        try:
            nickname = row['Created By']
            logger.info(f"Get user with name:  {nickname}")
            response = user_table.query(
                IndexName='userProfilesByNickname',  # Replace with your actual secondary index name
                KeyConditionExpression='nickname = :nickname',
                ExpressionAttributeValues={
                    ':nickname': nickname
                }
            )
            
            # If item already exists (response['Count'] > 0), skip the insertion
            if response['Count'] > 0:
                logger.info(f"User with nickname '{nickname}' already exists. Skipping insertion.")
                items = response.get('Items', [])  # This will be a list of dictionaries
                user_id = items[0].get('id')  # Get the 'id' of the first item
            else:
                user = {}
                # Generate and assign a UUID for the 'id' field
                user_id = str(uuid.uuid4())
                user['id'] = user_id
                user['createdAt'] = datetime.now().isoformat()  # Use the 'Created At' column as the 'createdAt' attribute
                user['updatedAt'] = datetime.now().isoformat()
                user['nickname'] = nickname
                # Add the fixed attributes to the user
                user.update(fixed_attributes_user)
                 # Insert the user into DynamoDB
                logger.info(f"Insert User: {user}")
                user_table.put_item(Item=user)
                logger.info(f"User with nickname '{nickname}' inserted successfully.")
            logger.info(f"User id: '{user_id}'")

        except Exception as e:
            return {'statusCode': 500, 'body': f'Error querying or inserting User into DynamoDB: {str(e)}'}
    

        # Check if an account with the same 'nickname' already exists in DynamoDB
        try:
            logger.info(f"Process row: {row}")
            account = {}
            # Generate and assign a UUID for the 'id' field
            account['id'] = str(uuid.uuid4())
            account['createdAt'] = row['Created']  # Use the 'Created At' column as the 'createdAt' attribute
            account['updatedAt'] = datetime.now().isoformat()
            account['lastActivityBy'] = user_id
            account['isMobile'] = str(is_mobile_number(row))
            account['comunicationPreferences'] = communication_preferences(row)

            # Map CSV columns to DynamoDB attributes using the mapping
            for csv_column, dynamodb_attr in column_mapping_account.items():
                if csv_column in row:
                    csv_value = row[csv_column]
                    if csv_value:
                        account[dynamodb_attr] = csv_value
            # Add the fixed attributes to the account
            account.update(fixed_attributes_account)
            # Insert the account into DynamoDB
            logger.info(f"Insert Account: {account}")
            account_table.put_item(Item=account)
            print(f"Account '{account['number']}' inserted successfully.")
        
        except Exception as e:
            return {'statusCode': 500, 'body': f'Error querying or inserting Account into DynamoDB: {str(e)}'}
    
    return {
        'statusCode': 200,
        'body': f'Successfully processed {len(df)} unique items from CSV file.'
    }