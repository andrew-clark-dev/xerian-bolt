import type { EventBridgeHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/fetch-from-source-function";
import { fetchNewData } from "./fetch_from_source";
import { SimpleResponse } from "../lib/api/api";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const logger = new Logger({ serviceName: "fetch-from-source" });


export const handler: EventBridgeHandler<"Scheduled Event", null, SimpleResponse> = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));

    try {
        const { data, errors } = await client.models.SyncData.list({
            filter: {
                interface: {
                    eq: 'account'
                }
            }
        });
        if (errors) {
            const error = new Error(`Error in list syncData: ${JSON.stringify(errors)}`);
            logger.error(error.message);
            throw error;
        }
        data.forEach(async (syncData) => {
            await fetchNewData(new Date(syncData.log.syncTime));
        });

        logger.info('Event processed successfully');
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
            }),
        };
    } catch (error: unknown) {

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