import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { ExternalAccount, toAccount } from "../../lib/services/account.external.sevice";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-account-function";
import AWS from "aws-sdk";

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

type UserProfile = Schema['UserProfile']['type'];
// type AccountStatus = Schema['Account']['type']['status'];
// type AccountKind = Schema['Account']['type']['kind'];

interface UserSettings {
    apiKey?: string;
    notifications: boolean;
    theme: 'light' | 'dark';
    hasLogin: false;
}

const initialSettings: UserSettings = {
    apiKey: undefined,
    notifications: true,
    theme: 'light',
    hasLogin: false,
};

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


async function provisionUser(id: string, name: string): Promise<UserProfile> {


    const { data: userProfile } = await client.models.UserProfile.get({ id });

    if (userProfile) {
        return userProfile;
    } else {
        logger.warn(`User not found - create : ${id}`);
        const { errors: actionErrors } = await client.models.Action.create({
            description: `Import of account creating a user profile`,
            modelName: "UserProfile",
            type: "Import",
            refId: id
        });

        if (actionErrors) {
            logger.error(`Failed to create import action - ${JSON.stringify(actionErrors)}`);
        }

        const { data: newUserProfile, errors: errors } = await client.models.UserProfile.create({
            id: id,
            status: "Pending",
            role: "Employee",
            nickname: name,
            settings: JSON.stringify(initialSettings),
        });

        if (newUserProfile) {
            return newUserProfile;
        } else {
            throw new Error(`Failed to create new user profile for userId: ${id} - ${JSON.stringify(errors)}`);
        }
    }
}
