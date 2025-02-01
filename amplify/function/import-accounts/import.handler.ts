import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { ExternalAccount, toAccount } from "../../lib/services/account.external.sevice";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-account-function";
import AWS from "aws-sdk";
import { ExternalUser, provisionService, userOf } from "../../lib/services/user.external.sevice";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const sqs = new AWS.SQS();

const logger = new Logger({ serviceName: "import-account-function" });


export const handler: SQSHandler = async (event) => {
    logger.info(`SQS event: ${JSON.stringify(event)}`);

    for (const record of event.Records) {
        try {
            logger.info(`Processing record: ${JSON.stringify(record)}`);
            const body = JSON.parse(record.body);
            const user: ExternalUser = body.createdBy;
            const exAccount: ExternalAccount = body.account;
            logger.info(`Get account by number: ${exAccount.number}`);

            const responce = await client.models.Account.get({ number: exAccount.number });
            if (responce.data) {
                logger.info(`Account already exists: ${exAccount.number}`);

            } else {
                logger.info(`Creating account: ${exAccount.number} - created by: ${user.name} - ${user.id}`);
                const profile = await provisionService.provisionUser(userOf(user));

                logger.info(`Creating account import action: ${exAccount.number}`);
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
            if (error instanceof Error) {
                logger.error(`Error processing record: ${error.message} - stack trace: ${error.stack}`);
            } else {
                logger.error(`Could not process record: ${error}`);
            }
            throw error;
        }
    }

}


