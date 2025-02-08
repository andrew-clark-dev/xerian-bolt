# utils.py

import pandas as pd
import re
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

def convert_column_to_isoformat(df, column_name):
    """
    Converts a specified date column in a DataFrame to ISO 8601 format.

    Parameters:
    df (pandas.DataFrame): The DataFrame containing the date column.
    column_name (str): The name of the column to convert.

    Returns:
    pandas.DataFrame: The DataFrame with the converted date column.
    """
    if column_name in df.columns:
        df[column_name] = pd.to_datetime(df[column_name], errors='coerce')
        df[column_name] = df[column_name].apply(lambda x: x.isoformat() if pd.notnull(x) else None)
    return df


def convert_column_to_number(df, column_name):
    """
    Converts a specified column in a DataFrame to a numeric format.

    Parameters:
    df (pandas.DataFrame): The DataFrame containing the column.
    column_name (str): The name of the column to convert.

    Returns:
    pandas.DataFrame: The DataFrame with the converted column.
    """
    if column_name in df.columns:
        df[column_name] = pd.to_numeric(df[column_name], errors='coerce')
    return df


MOBILE_REGEX = re.compile(r'078|076|079|0.*78|0.*76|0.*79')


def is_mobile_number(row):
    """
    Checks if an account phone number indicates a mobile number based on Swiss mobile prefixes.
    
    Args:
        ex_account (dict): The account read from the external system.
        
    Returns:
        bool: True if the number is a mobile number, False otherwise.
    """
    if 'Phone' in row:
        phone_number = row['Phone']
        if phone_number:
            logger.info(f"Phone number: {phone_number}")
            return bool(MOBILE_REGEX.search(phone_number))
    return False


def communication_preferences(row):
    """
    Calculates the communication preferences based on the phone number and email address.
    
    Args:
        ex_account (dict): The account read from the external system.
        
    Returns:
        str: The communication preference - "TextMessage", "Email", or "None".
    """
    if is_mobile_number(row):
        return "TextMessage"
    
    if row.get('email'):
        return "Email"
    
    return "None"