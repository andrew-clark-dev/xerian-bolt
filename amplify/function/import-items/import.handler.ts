import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-item-function";
import { SQS } from 'aws-sdk';
import { ExternalItem, toCategories, toGroup, toItem } from "../../lib/services/item.external.sevice";
import { ExternalUser, provisionService, userOf } from "../../lib/services/user.external.sevice";

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
            const user: ExternalUser = body.createdBy;
            const exItem: ExternalItem = body.item;
            logger.info(`Processing record: ${JSON.stringify(record)}`);
            logger.info(`Get item by sku: ${exItem.sku}`);

            const repsonce = await client.models.Item.get({ sku: exItem.sku });

            if (repsonce.data) {
                logger.info(`Item already exists: ${exItem.sku}`);

            } else {
                logger.info(`Creating item: ${exItem.sku}`);
                const profile = await provisionService.provisionUser(userOf(user));

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
                const newItem = toItem(exItem);
                const { data: item, errors } = await client.models.Item.create(newItem);
                if (errors) {
                    logger.error(`Errors in creating item : errors: ${JSON.stringify(errors)} - item: ${JSON.stringify(newItem)}`);
                    continue;
                }

                if (item) {
                    logger.info(`Creating item categories: ${exItem.sku}`);
                    const { category, brand, color, size } = toCategories(item);
                    await client.models.ItemCategory.create(category);
                    await client.models.ItemCategory.create(brand);
                    await client.models.ItemCategory.create(color);
                    await client.models.ItemCategory.create(size);
                } else {
                    logger.error(`Data is null, cannot categorize item.`);
                    continue;
                }

                if ((exItem.quantity ?? 0) > 1) {
                    logger.info(`Creating item group, quatity : ${exItem.quantity}`);
                    const { errors } = await client.models.ItemGroup.create(toGroup(exItem));
                    if (errors) {
                        logger.error(`Errors in creating item group : ${JSON.stringify(errors)}`);
                    }
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
