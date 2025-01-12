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
        const newSyncData = {
            interface: "account",
            lastSync: new Date().toISOString(),
        }

        const { data } = await client.models.SyncData.get({ interface: "account" });
        const lastSync = new Date(data?.lastSync || "2000-01-01 00:00:00");

        await fetchNewData(lastSync);

        if (!data) {
            await client.models.SyncData.create(newSyncData);
        } else {
            await client.models.SyncData.update(newSyncData);
        }

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