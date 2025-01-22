import type { EventBridgeHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SQS } from 'aws-sdk';
import { itemClient, itemFetchParams } from "../../lib/services/item.external.sevice";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-account-function";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

const APP_CONFIG_NAME = 'imported_ttems_up_to';

const logger = new Logger({ serviceName: "fetch-external-items" });
const sqs = new SQS();
const queueUrl = process.env['IMPORT_QUEUE_URL']!;
// Threshold to exit early (e.g., 5000 ms = 5 seconds)
const threshold = 5000;
let earlyExit = false;

export const handler: EventBridgeHandler<"Scheduled Event", null, { statusCode: number, body: string }> = async (event, context) => {
    logger.info("event", JSON.stringify(event, null, 2));

    try {

        let { data: appConfig } = await client.models.AppConfig.get({ name: APP_CONFIG_NAME });

        if (!appConfig) {
            // Create AppConfig if it doesn't exist, initialized to 2000-01-01
            const { data } = await client.models.AppConfig.create({ name: APP_CONFIG_NAME, value: new Date(2000, 1, 1).toISOString() });
            appConfig = data;
        }
        let upTo = appConfig!.value!;
        logger.info(`upTo: ${upTo}`);
        const fetchParams = itemFetchParams;
        fetchParams['created:gte'] = upTo;
        do {
            const page = await itemClient.fetch(fetchParams);
            for (const item of page?.data || []) {
                const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify({
                        createdBy: item.created_by,
                        item: item,
                    }),
                };
                try {
                    sqs.sendMessage(params, (err, data) => {
                        if (err) {
                            logger.error(`Error sending message to queue: ${item.id}`, err as Error);
                        } else {
                            logger.info(`Message sent to queue: ${data.MessageId || 'No Id'} : ${data.SequenceNumber || 'No Sequance Number'}`);
                        }
                    });
                } catch (error) {
                    logger.error(`Error pushing item to queue: ${item.id}`, error as Error);
                }
                upTo = item.created;
            }
            fetchParams.cursor = page?.next_cursor || null;

            const remainingTime = context.getRemainingTimeInMillis();
            earlyExit = remainingTime < threshold;

        } while (fetchParams.cursor && !earlyExit);

        if (earlyExit) { logger.warn(`Early exit triggered.`) }

        logger.info('Event processed successfully');
        await client.models.AppConfig.update({ name: APP_CONFIG_NAME, value: upTo });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
            }),
        };
    } catch (error) {

        logger.error(`Error fetching SyncData: ${JSON.stringify(error)}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching SyncData',
                error: (error instanceof Error) ? error.message : 'Unknown error',
            }),
        };
    }
};