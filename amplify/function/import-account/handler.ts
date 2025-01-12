import type { SQSHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-account-function";
import AWS from "aws-sdk";
import { ExternalAccount } from "../fetch-account-updates/fetch_from_source";

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
type AccountStatus = Schema['Account']['type']['status'];
type AccountKind = Schema['Account']['type']['kind'];

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
            const userId = body.createdById;
            const exAccount: ExternalAccount = body.account;
            const profile = await provisionUser(userId, exAccount.created_by.name);

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

            const accountParams = {
                id: exAccount.id,
                number: exAccount.number,
                lastActivityBy: profile.id,
                firstName: exAccount.first_name,
                lastName: exAccount.last_name,
                email: exAccount.email,
                phoneNumber: exAccount.phone_number,
                isMobile: isMobile(exAccount),
                addressLine1: exAccount.address_line_1,
                addressLine2: exAccount.address_line_2,
                city: exAccount.city,
                state: exAccount.state,
                postcode: exAccount.postal_code,
                comunicationPreferences: getPrefs(exAccount),
                status: 'Active' as AccountStatus,
                kind: 'Standard' as AccountKind,
                defaultSplit: exAccount.default_split == null ? null : (100 * exAccount.default_split!),
                balance: exAccount.balance,
            }

            const { data: account } = await client.models.Account.get({ number: exAccount.number });

            if (account) {
                logger.info(`Updating account: ${exAccount.number}`);
                const { errors } = await client.models.Account.update(accountParams);
                if (errors) {
                    logger.error(`Errors in updating account: ${JSON.stringify(errors)}`);
                    continue;
                }
            } else {
                logger.info(`Creating account: ${exAccount.number}`);
                const { errors } = await client.models.Account.create(accountParams);

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

function isMobile(account: ExternalAccount): boolean {
    const phone_number = account.phone_number ?? '';
    const regex = /078|076|079|(0).*78|(0).*78|(0).*78/gm;
    return regex.test(phone_number.trim());
}

function getPrefs(account: ExternalAccount): "TextMessage" | "Email" | "None" {
    if (isMobile(account)) {
        return "TextMessage";
    }
    if (account.email) {
        return "Email";
    }
    return "None";
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
            role: "Guest",
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
