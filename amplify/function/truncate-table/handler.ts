import { type Schema } from "../../data/resource";
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: Schema["truncateTable"]["functionHandler"] = async (event) => {
    const tableName = process.env[event.arguments.tablename!]!;

    try {

        const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: tableName,
            ExclusiveStartKey: undefined,
        };
        let itemsToDelete: AWS.DynamoDB.DocumentClient.ItemList = [];

        // Scan the table and handle pagination
        do {
            const scanResult = await docClient.scan(scanParams).promise();
            if (scanResult.Items) {
                itemsToDelete = itemsToDelete.concat(scanResult.Items);
            }

            // Set the ExclusiveStartKey for the next scan if there are more items
            scanParams.ExclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (scanParams.ExclusiveStartKey);

        // Batch delete items
        const deleteRequests = itemsToDelete.map(item => ({
            DeleteRequest: {
                Key: { id: item.id }
            }
        }));

        const batchWriteParams = {
            RequestItems: {
                [tableName]: deleteRequests
            }
        };

        // DynamoDB batchWrite can handle a maximum of 25 items at a time
        while (batchWriteParams.RequestItems[tableName].length > 0) {
            const batch = batchWriteParams.RequestItems[tableName].splice(0, 25);
            await docClient.batchWrite({ RequestItems: { [tableName]: batch } }).promise();
        }

        return `Table ${tableName} truncated successfully`;
    } catch (error) {
        console.error(`Error truncating table: ${tableName}`, error);
        throw new Error(`Error truncating table: ${error}`);
    }

};