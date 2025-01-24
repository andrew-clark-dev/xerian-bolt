import type { DynamoDBBatchItemFailure, DynamoDBStreamHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import AWS from 'aws-sdk';
import { env } from "$amplify/env/create-action-function";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const logger = new Logger({ serviceName: "create-action-function" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const handler: DynamoDBStreamHandler = async (event) => {
    logger.info(`Received event: ${JSON.stringify(event)}`);
    const fail: DynamoDBBatchItemFailure[] = [];

    for (const record of event.Records) {
        try {
            logger.info(`Processing record: ${record.eventID}`);
            logger.info(`Event Type: ${record.eventName}`);
            logger.info(`Event: ${JSON.stringify(record)}`);

            if (record.eventName === "INSERT") {
                // business logic to process new records
                const newImage = record.dynamodb!.NewImage!;
                const modelName = newImage.__typename.S;
                logger.info(`New ${modelName} Image: ${JSON.stringify(newImage)}`);
                const { errors } = await client.models.Action.create({
                    type: "Create",
                    description: `Created ${modelName} - (auto-log)`,
                    userId: newImage.lastActivityBy.S,
                    modelName: modelName,
                    refId: newImage.id.S,
                    after: JSON.stringify(newImage)
                });

                if (errors) {
                    logger.error(`Errors in creating action: ${errors}`);
                    fail.push({ itemIdentifier: newImage.id.S! });
                    continue;
                }

                const params = {
                    TableName: env.COUNTER_TABLE_NAME,
                    Key: { name: `${modelName}Total` },
                    UpdateExpression: `ADD val :plusOne`,
                    ExpressionAttributeValues: { ':plusOne': 1 },
                    ReturnValues: 'UPDATED_NEW',
                };
                try {
                    const result = await dynamoDb.update(params).promise();
                    logger.info(`Counter updated: ${JSON.stringify(result)}`);
                } catch (error) {
                    logger.error(`Errors in incrementing count: ${error}`);
                    fail.push({ itemIdentifier: newImage.id.S! });
                    continue;
                }
            } else if (record.eventName === "MODIFY") {
                // business logic to process updated records
                const newImage = record.dynamodb!.NewImage!;
                const oldImage = record.dynamodb!.OldImage!;
                const modelName = newImage.__typename.S;
                logger.info(`New ${modelName} Image: ${JSON.stringify(newImage)}`);
                logger.info(`Old ${modelName} Image: ${JSON.stringify(oldImage)}`);
                const { errors } = await client.models.Action.create({
                    type: "Update",
                    description: `Updated ${modelName} - (auto-log)`,
                    userId: newImage.lastActivityBy.S,
                    modelName: modelName,
                    refId: newImage.id.S,
                    before: JSON.stringify(oldImage),
                    after: JSON.stringify(newImage)
                });

                if (errors) {
                    console.error(`Errors in creating action:`, errors);
                    fail.push({ itemIdentifier: newImage.id.S! });
                }

                // } else if (record.eventName === "REMOVE") {
                //     // business logic to process deleted records
                //     const oldImage = record.dynamodb!.OldImage!;
                //     const modelName = oldImage.__typename.S;
                //     logger.info(`Old ${modelName} Image: ${JSON.stringify(oldImage)}`);
                //     const { errors } = await client.models.Action.create({
                //         type: "Delete",
                //         description: `Deleted ${modelName} - (auto-log)`,
                //         userId: oldImage.lastActivityBy.S,
                //         modelName: modelName,
                //         refId: oldImage.id.S,
                //         before: JSON.stringify(oldImage)
                //     });

                //     if (errors) {
                //         console.error(`Errors in creating action:`, errors);
                //         fail.push({ itemIdentifier: oldImage.id.S! });
                //         continue;
                //     }

                //     const params = {
                //         TableName: env.COUNTER_TABLE_NAME,
                //         Key: { name: [`${modelName}Total`] },
                //         UpdateExpression: `ADD val :minusOne`,
                //         ExpressionAttributeValues: { ':minusOne': -1 },
                //         ReturnValues: 'UPDATED_NEW',
                //     };
                //     try {
                //         const result = await dynamoDb.update(params).promise();
                //         logger.info(`Counter updated: ${JSON.stringify(result)}`);
                //     } catch (error) {
                //         console.error(`Error in decrementing count:`, error);
                //         fail.push({ itemIdentifier: oldImage.id.S! });
                //         continue;
                //     }
            }
        } catch (error) {
            console.error(`Error creating profile:`, error);
        }
    }
    logger.info(`Successfully processed ${event.Records.length} records.`);

    return {
        batchItemFailures: fail,
    };
};