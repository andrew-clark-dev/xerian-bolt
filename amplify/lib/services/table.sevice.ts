import { AttributeMap } from "aws-sdk/clients/dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";

import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

const logger = new Logger({ serviceName: "table-service" });

export const resetData = async (models: Map<string, string>) => {
    const counterTableName = process.env['COUNTER_TABLE']!;

    for (const [modelName, index] of models) {
        const name = modelName.toUpperCase() + '_TABLE';
        await truncateTable(name, index);
        await resetCount(modelName, counterTableName);
    }

}

export const resetCount = async (modelName: string, counterTable: string) => {
    logger.info(`Reset model count for: ${modelName} in table: ${counterTable}`);
    // Define the item to upsert
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: counterTable,
        Item: {
            name: `${modelName}Total`,
            val: 0,
            createdAt: new Date().toISOString(), // Add/update timestamp
            updatedAt: new Date().toISOString(), // Add/update timestamp
            __typename: 'Counter',
        },
    };

    try {
        // Perform the upsert (PutItem operation)
        const result = await docClient.put(params).promise();
        logger.info(`Counter updated: ${JSON.stringify(result)}`);
    } catch (error) {
        logger.error(`Errors in incrementing count: ${error}`);
    }
}

export const truncateTable = async (name: string, index: string) => {
    logger.info(`Truncate: ${name}`);

    const tableName = process.env[name]!;

    const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = { TableName: tableName };
    let itemsToDelete: AWS.DynamoDB.DocumentClient.ItemList = [];


    try {
        // Scan the table and handle pagination
        logger.info(`ScanTable  ${scanParams.TableName} with ${index}`);
        do {
            try {
                const scanResult = await docClient.scan(scanParams).promise();
                logger.info(`Deleting ${scanResult.Count || "No"} records from ${tableName}`);
                if (scanResult && scanResult.Items) {
                    itemsToDelete = itemsToDelete.concat(scanResult.Items);
                }
                // Set the ExclusiveStartKey for the next scan if there are more items
                scanParams.ExclusiveStartKey = scanResult?.LastEvaluatedKey;
            } catch (error) {
                logger.error(`Error scanning table: ${tableName}, error: ${error}`);
                throw error;
            }

        } while (scanParams.ExclusiveStartKey);

        const itemChunks = chunkArray(itemsToDelete, 25);

        // For every chunk of 25 items, make one BatchWrite request.
        for (const chunk of itemChunks) {
            const deleteRequests = chunk.map((item: AttributeMap) => ({
                DeleteRequest: {
                    Key: { [index]: item[index] },
                },
            }));

            console.info(`Delete Requests: ${JSON.stringify(deleteRequests)}`);

            await docClient.batchWrite({ RequestItems: { [tableName]: deleteRequests } }).promise();
        }
        logger.info(`Table ${tableName} truncated successfully, ${itemsToDelete.length} items deleted`);
    } catch (error) {
        logger.error(`Error truncating table: ${tableName}, error ${error}`);
        throw error;
    }

};


/**
 *
 * @param {Array} arr
 * @param {number} stride
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* chunkArray(arr: any, stride = 1) {
    for (let i = 0; i < arr.length; i += stride) {
        yield arr.slice(i, Math.min(i + stride, arr.length));
    }
}