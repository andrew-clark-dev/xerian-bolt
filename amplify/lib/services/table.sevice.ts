import { AttributeMap } from "aws-sdk/clients/dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";
import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";

import * as AWS from 'aws-sdk';
import { ExternalUser, provisionService } from "./user.external.sevice";

const docClient = new AWS.DynamoDB.DocumentClient();
const ssmClient = new SSMClient();
const lambdaName = process.env.AWS_LAMBDA_FUNCTION_NAME || "no_lambda";

const logger = new Logger({ serviceName: "table-service" });

export const importUserId = 'f838ed77-7eec-4d85-85f8-ca022ff42a84';

export const externalUserId = '0d1cd38e-551f-4c9e-b753-275d0e073bba';

export const unknownExternalUser: ExternalUser = {
    id: '0d1cd38e-551f-4c9e-b753-275d0e073bba',
    name: 'UnknownExternalUser',
    user_type: 'employee'
};

export const resetData = async (models: Map<string, string[]>) => {
    const counterTableName = process.env['COUNTER_TABLE']!;

    for (const [modelName, index] of models) {
        const name = modelName.toUpperCase() + '_TABLE';
        await truncateTable(name, index);
        await resetCount(modelName, counterTableName);
    }

    // Provision the service users.
    await provisionService.provisionUser({ id: importUserId, nickname: 'ImportServiceUser', status: 'Active', role: 'Service' });
    await provisionService.provisionUser({ id: unknownExternalUser.id, nickname: unknownExternalUser.name, status: 'Active', role: 'Service' });

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

export const truncateTable = async (name: string, index: string[]) => {
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
                    Key: Object.fromEntries(index.map(key => [key, item[key]]),),
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

// Function to read a parameter from Parameter Store with optional default value
export const readParameter = async (paramName: string, defaultValue?: string) => {
    const fullParamName = `/xerian/${lambdaName}/${paramName}`;
    try {
        const command = new GetParameterCommand({ Name: fullParamName, WithDecryption: true });
        const response = await ssmClient.send(command);
        console.log(`Parameter retrieved: ${response.Parameter?.Value}`);
        return response.Parameter?.Value;
    } catch (error) {
        if (error instanceof Error && error.name === "ParameterNotFound" && defaultValue !== undefined) {
            console.warn(`Parameter not found: ${fullParamName}, returning default value.`);
            return defaultValue;
        }
        console.error("Error reading parameter:", error);
        throw new Error(`Failed to read parameter: ${fullParamName}`);
    }
};

// Function to write a parameter to Parameter Store
export const writeParameter = async (paramName: string, paramValue: string) => {
    const fullParamName = `/xerian/${lambdaName}/${paramName}`;
    try {
        const command = new PutParameterCommand({
            Name: fullParamName,
            Value: paramValue,
            Type: "SecureString", // Use 'String' if not sensitive
            Overwrite: true,
        });
        await ssmClient.send(command);
        console.log(`Parameter written: ${fullParamName}`);
    } catch (error) {
        console.error("Error writing parameter:", error);
        throw new Error(`Failed to write parameter: ${fullParamName}`);
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