import type { EventBridgeHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/fetch-from-source";
import { fetchNewData } from "./fetch_from_source";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const logger = new Logger({
    logLevel: "INFO",
    serviceName: "fetch-from-source",
});



export const handler: EventBridgeHandler<"Scheduled Event", null, void> = async (event, context) => {
    logger.info("event", JSON.stringify(event, null, 2));

    try {
        const { data, errors } = await client.models.SyncData.list();
        if (errors) {
            const error = new Error(`Error in list syncData: ${errors}`);
            logger.error(error.message);
            throw error;
        }
        const newData = await fetchNewData(context, 'YWI3YWViMGItYWIwMS00YTcyLWI0ODktYzZhYzdhYTEyMTlmOnZsN0UybnZpaTdPYldIb0QwdFF5bVE=', data);

        newData.forEach(async (syncData) => {
            client.models.SyncData.update(syncData);
        });

        console.log("SyncData", data);
    } catch (error) {
        console.error("Error fetching SyncData:", error);
    }

};