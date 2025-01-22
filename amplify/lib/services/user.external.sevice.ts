import { Schema } from "../../data/resource";
import { Logger } from "@aws-lambda-powertools/logger";
import { generateClient } from "aws-amplify/data";

export type UserProfile = Schema['UserProfile']['type'];

const client = generateClient<Schema>();


export interface ExternalUser {
    id: string,
    name: string,
    user_type: string,
}

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


export async function provisionUser(id: string, name: string): Promise<UserProfile> {

    const logger = new Logger({ serviceName: "user-external-service" });

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