import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
    console.log(`PostConfirmationTriggerHandler event:`, event);
    try {
        const { errors, data: newUserProfile } = await client.models.UserProfile.create({
            email: event.request.userAttributes.email,
            profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
            username: event.userName,
            status: "Pending",
            role: "Guest",
            nickname: event.request.userAttributes.nickname,
            settings: JSON.stringify({
                apiKey: undefined,
                notifications: true,
                theme: 'light',
                hasLogin: false,
            }), // Initial settings
        });
        if (errors) {
            console.error(`Errors in creating profile:`, errors);
        } else {
            console.log(`Created profile:`, newUserProfile);
        }
    } catch (error) {
        console.error(`Error creating profile:`, error);
    }

    return event;
};