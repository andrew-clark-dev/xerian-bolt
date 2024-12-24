import type { DynamoDBStreamHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
// import { Amplify } from "aws-amplify";
// import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
// import { env } from "$amplify/env/create-action-function";

// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
//     env
// );

// Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const logger = new Logger({
    logLevel: "INFO",
    serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
    for (const record of event.Records) {
        try {
            logger.info(`Processing record: ${record.eventID}`);
            logger.info(`Event Type: ${record.eventName}`);
            logger.info(`Event: ${JSON.stringify(record)}`);

            if (record.eventName === "INSERT") {
                // business logic to process new records
                logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
                const { errors } = await client.models.Action.create({
                    description: "Created a Account",
                    userId: "defaultUsername",
                    // Initial settings
                });
                if (errors) {
                    console.error(`Errors in creating action:`, errors);
                }



            }
        } catch (error) {
            console.error(`Error creating profile:`, error);
        }
    }
    logger.info(`Successfully processed ${event.Records.length} records.`);

    return {
        batchItemFailures: [],
    };
};