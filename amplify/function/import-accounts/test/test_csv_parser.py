import unittest
import pandas as pd
import numpy as np
from io import StringIO
from unittest.mock import MagicMock
from csv_parser import parse_account_csv  # Import the function you want to test
from pathlib import Path

# Get the path to the test file directory
TEST_DIR = Path(__file__).parent

# Construct the path to the file (e.g., test_data.csv is in the same folder as the test file)
file_path = TEST_DIR / "test/Account Export.csv"


class TestCSVParser(unittest.TestCase):

    def setUp(self):
        # Create a mock DynamoDB put function
        self.mock_put_function = MagicMock()

    def test_csv_parsing_and_put(self):
        """Test if the CSV file is correctly parsed and put_function is called correctly."""
        parse_account_csv(file_path, self.mock_put_function)

if __name__ == '__main__':
    unittest.main()
