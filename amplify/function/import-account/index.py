import boto3
import pandas as pd
import numpy as np

import uuid  # Import the uuid module
import os  # Import the os module to access environment variables
import json
from datetime import datetime  # For adding timestamp attribute
import io  # For handling in-memory byte data
import import_account
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

# Initialize S3 client
s3_client = boto3.client('s3')

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
    
    if object_key.startswith('import/Account'):
        return import_account(csv_content)
        
    return {'statusCode': 500, 'body': f'Unsupported file type: {object_key}'}
