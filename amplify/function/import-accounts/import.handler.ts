import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { ExternalAccount, toAccount } from "../../lib/services/account.external.sevice";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-account-function";
import AWS from "aws-sdk";
import { provisionUser } from "../../lib/services/user.external.sevice";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const sqs = new AWS.SQS();

const logger = new Logger({
    logLevel: "INFO",
    serviceName: "import-account-function",
});


export const handler: SQSHandler = async (event) => {
    logger.info(`SQS event: ${JSON.stringify(event)}`);

    for (const record of event.Records) {
        try {
            logger.info(`Processing record: ${JSON.stringify(record)}`);
            const body = JSON.parse(record.body);
            const user = body.createdBy;
            const exAccount: ExternalAccount = body.account;

            const { data: account } = await client.models.Account.get({ number: exAccount.number });

            if (account) {
                logger.info(`Account already exists: ${exAccount.number}`);

            } else {
                const profile = await provisionUser(user.id, user.name);
                const { errors: actionErrors } = await client.models.Action.create({
                    description: `Import of account`,
                    modelName: "Account",
                    type: "Import",
                    typeIndex: "Import",
                    refId: exAccount.id,
                    userId: profile.id,
                });

                if (actionErrors) {
                    logger.error(`Failed to create import action - ${JSON.stringify(actionErrors)}`);
                }

                logger.info(`Creating account: ${exAccount.number}`);

                const { errors } = await client.models.Account.create(toAccount(exAccount));

                if (errors) {
                    logger.error(`Errors in creating account: ${JSON.stringify(errors)}`);
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


