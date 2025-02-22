import { Schema } from "../../data/resource";
import { Logger } from "@aws-lambda-powertools/logger";
import { generateClient } from "aws-amplify/data";

export type UserProfile = Schema['UserProfile']['type'];
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'comments' | 'actions' | 'createdAt' | 'updatedAt'>> & { id: string };

const client = generateClient<Schema>();
const logger = new Logger({ serviceName: "user-external-service" });

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
    notifications: true,
    theme: 'light',
    hasLogin: false,
};

export function userOf(exUser: ExternalUser): UserProfileUpdate {
    return {
        id: exUser.id,
        status: "Pending",
        role: "Employee",
        nickname: exUser.name,
        settings: JSON.stringify(initialSettings),
    };
}

export class ProvisionService {

    users: Map<string, UserProfile> = new Map();

    async provisionUser(user: UserProfileUpdate): Promise<UserProfile> {

        const existingUser = this.users.get(user.id);
        if (existingUser) { return existingUser; }

        logger.info(`Provision user : ${user.id} - ${user.nickname}`);

        const { data: userProfile } = await client.models.UserProfile.get({ id: user.id });

        if (userProfile) {
            this.users.set(userProfile.id, userProfile);
            return userProfile;
        } else {
            logger.warn(`User not found - create : ${user.id} - ${user.nickname}`);
            const { errors: actionErrors } = await client.models.Action.create({
                description: `Import creating a user profile`,
                modelName: "UserProfile",
                type: "Import",
                typeIndex: "Import",
                refId: user.id
            });

            if (actionErrors) {
                logger.error(`Failed to create import action - ${JSON.stringify(actionErrors)}`);
            }

            const { data: newUserProfile, errors: errors } = await client.models.UserProfile.create(user);

            if (newUserProfile) {
                this.users.set(newUserProfile.id, newUserProfile);
                return newUserProfile;
            } else {
                throw new Error(`Failed to create new user profile for userId: ${user.id} - ${JSON.stringify(errors)}`);
            }
        }
    }

    async provisionUserByName(nickname: string): Promise<UserProfile> {

        const existingUser = this.users.get(nickname);
        if (existingUser) { return existingUser; }

        logger.info(`Provision user : ${nickname} `);

        const { data } = await client.models.UserProfile.listUserProfileByNickname({ nickname: nickname });


        if (data.length > 0) {
            const userProfile = data[0];
            this.users.set(nickname, userProfile);
            logger.info(`User found : ${nickname}`);
            return userProfile;
        } else {
            logger.warn(`User not found - create : ${nickname}`);

            const { data: newUserProfile, errors: errors } = await client.models.UserProfile.create(
                {
                    status: "Pending",
                    role: "Employee",
                    nickname: nickname,
                    settings: JSON.stringify(initialSettings),
                }
            );

            if (newUserProfile) {
                const { errors: actionErrors } = await client.models.Action.create({
                    description: `Import creating a user profile`,
                    modelName: "UserProfile",
                    type: "Import",
                    typeIndex: "Import",
                    refId: newUserProfile.id
                });

                if (actionErrors) {
                    logger.error(`Failed to create import action - ${JSON.stringify(actionErrors)}`);
                } this.users.set(newUserProfile.id, newUserProfile);
                return newUserProfile;
            } else {
                throw new Error(`Failed to create new user profile for : ${nickname} - ${JSON.stringify(errors)}`);
            }
        }
    }
}

export const provisionService = new ProvisionService();