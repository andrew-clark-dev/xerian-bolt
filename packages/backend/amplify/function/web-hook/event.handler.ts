import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/create-action-function";
import { findItemById, itemClient, toItem } from "../../lib/services/item.external.sevice";
import { getAccountById } from "../../lib/services/account.external.sevice";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const logger = new Logger({ serviceName: "find-external-account" });

export const handler: SQSHandler = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        try {
            logger.info("Processing message:", record.body);

            const message = JSON.parse(record.body);
            const itemId = message.payload.itemId;
            const extItem = await itemClient.get(itemId);

            if (!extItem) {
                logger.error("External item not found:", itemId);
                throw new Error("External item not found");
            }
            const updateItem = toItem(extItem);

            // Check if the item already exists
            const { data: existing } = await client.models.Item.get(itemId);

            // Check if the update involves a new Account
            const accountId = extItem.account?.id
            if (accountId) {
                const { data: accounts } = await client.models.Account.listAccountById({ id: accountId });
                if (accounts.length === 0) {
                    logger.info("Account not found, create new account");
                    const newAccount = await getAccountById(accountId);
                    client.models.Account.create(newAccount!);
                }
            }


            switch (message.topic) {
                case "item.created":
                    // Process item created event
                    if (existing) {
                        logger.warn("Item already exists:", existing);
                    } else {
                        await client.models.Item.create(updateItem);
                        logger.info("Item created", updateItem);
                    }
                    break;

                case "item.sold":
                case "item.updated":
                    // Process order updated event
                    await client.models.Item.update(updateItem!);
                    logger.info("Item updated", updateItem);


                    break;



                default:
                    logger.error("Unknown message topic:", message.topic);
                    throw new Error("Unknown message topic");

            }
            logger.info("Message processed successfully:", record.body);

            // ✅ No need to manually delete, AWS Lambda will remove it on success

        } catch (error) {
            console.error("Message processing failed:", error);

            // ❌ Do NOT delete the message manually; SQS will retry it automatically
            throw error; // Re-throw the error to trigger a retry
        }
    }
};