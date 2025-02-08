import pandas as pd
import numpy as np

from utils import convert_column_to_isoformat, convert_column_to_number

def parse_account_csv(file_path, put_function):
    """Reads a CSV file, processes the data, and inserts it into DynamoDB using the provided put function."""
    df = pd.read_csv(file_path, dtype=str)  # Read all as strings initially
    df = df.replace({np.nan: None})  # Replace NaN with None
    date_columns = ['Created', 'Deactivated', 'Last Activity', 'Last Settlement']
    for col in date_columns:
        df = convert_column_to_isoformat(df, col)
    
    # Convert number columns to numeric format
    number_columns = ['Balance', 'Default Split', 'Number Of Items', 'Number Of Sales']
    for col in number_columns:
        df = convert_column_to_number(df, col)

    # Write each row to DynamoDB with a UUID and fixed attributes
    for _, row in df.iterrows():
        if 'Created By' in row:
            nickname = row['Created By']
            print(f"Get user with name:  {nickname}")
        if 'Phone' in row:
            phone_number = row['Phone']
            if phone_number:
                print(f"Get user with phone:  {phone_number}")
    #     item = {
    #         'id': row['id'],
    #         'name': row['name'],
    #         'date_column': row['date_column'].isoformat() if pd.notnull(row['date_column']) else None,
    #         'numeric_column': row['numeric_column'],
    #     }
    #     put_function(item)  # Call the provided function to insert into DynamoDB
    
    return df
