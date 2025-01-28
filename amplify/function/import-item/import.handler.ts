import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-item-function";
import { SQS } from 'aws-sdk';
import { ExternalItem, toCategories, toItem } from "../../lib/services/item.external.sevice";
import { provisionUser } from "../../lib/services/user.external.sevice";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const sqs = new SQS();

const logger = new Logger({ serviceName: "import-item-function" });


export const handler: SQSHandler = async (event) => {
    logger.info(`SQS event: ${JSON.stringify(event)}`);

    for (const record of event.Records) {
        try {
            logger.info(`Processing record: ${JSON.stringify(record)}`);
            const body = JSON.parse(record.body);
            const user = body.createdBy;
            const exItem: ExternalItem = body.item;

            const { data: item } = await client.models.Item.get({ sku: exItem.sku });

            if (item) {
                logger.info(`Item already exists: ${exItem.sku}`);

            } else {
                const profile = await provisionUser(user.id, user.name);
                const { errors: actionErrors } = await client.models.Action.create({
                    description: `Import of item`,
                    modelName: "Item",
                    type: "Import",
                    typeIndex: "Import",
                    refId: exItem.id,
                    userId: profile.id,
                });

                if (actionErrors) {
                    logger.error(`Failed to create import action - ${JSON.stringify(actionErrors)}`);
                }

                logger.info(`Creating item: ${exItem.sku}`);

                const { data, errors } = await client.models.Item.create(toItem(exItem));
                if (errors) {
                    logger.error(`Errors in creating item : ${JSON.stringify(errors)}`);
                    continue;
                }

                if (data) {
                    const { category, brand, color, size } = toCategories(data);
                    await client.models.ItemCategory.create(category);
                    await client.models.ItemCategory.create(brand);
                    await client.models.ItemCategory.create(color);
                    await client.models.ItemCategory.create(size);
                } else {
                    logger.error(`Data is null, cannot categorize item.`);
                    continue;
                }

            }

            // Delete the message from the queue upon successful processing
            sqs.deleteMessage({
                QueueUrl: record.eventSourceARN,
                ReceiptHandle: record.receiptHandle,
            });

        } catch (error) {
            logger.error(`Error processing record: ${JSON.stringify(error)}`);
        }
    }

}
