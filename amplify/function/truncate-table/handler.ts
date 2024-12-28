import { AttributeMap } from "aws-sdk/clients/dynamodb";
import { type Schema } from "../../data/resource";
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();

export const handler: Schema["truncateTable"]["functionHandler"] = async (event) => {
    console.info(`Truncate table event: ${JSON.stringify(event)}`);

    const tableName = process.env[event.arguments.tablename!]!;


    console.info(`Table to truncate: ${tableName}`);

    try {
        const response = await dynamodb.describeTable({ TableName: tableName }).promise();
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const keyString = response.Table?.KeySchema?.find((key) => key.KeyType === 'HASH')!.AttributeName!;
        console.info(`Key: ${keyString}`);
        const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: tableName,
        };
        let itemsToDelete: AWS.DynamoDB.DocumentClient.ItemList = [];

        // Scan the table and handle pagination
        do {
            const scanResult = await docClient.scan(scanParams).promise();
            console.info(`Deleting ${scanResult.Count || "No"} records from ${tableName}`);

            if (scanResult.Items) {
                itemsToDelete = itemsToDelete.concat(scanResult.Items);
            }

            // Set the ExclusiveStartKey for the next scan if there are more items
            scanParams.ExclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (scanParams.ExclusiveStartKey);

        const itemChunks = chunkArray(itemsToDelete, 25);

        // For every chunk of 25 movies, make one BatchWrite request.
        for (const chunk of itemChunks) {
            const deleteRequests = chunk.map((item: AttributeMap) => ({
                DeleteRequest: {
                    Key: { [keyString]: item[keyString] },
                },
            }));

            console.info(`Delete Requests: ${JSON.stringify(deleteRequests)}`);

            await docClient.batchWrite({ RequestItems: { [tableName]: deleteRequests } }).promise();
        }

        return `Table ${tableName} truncated successfully`;
    } catch (error) {
        console.error(`Error truncating table: ${tableName}`, error);
        throw new Error(`Error truncating table: ${error}`);
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