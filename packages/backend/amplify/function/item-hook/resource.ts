import { defineFunction, secret } from "@aws-amplify/backend";

export const itemHookFunction = defineFunction({
    name: "item-hook-function",
    environment: {
        API_KEY: secret('API_KEY'),
        STORE_ID: secret('STORE_ID'),
    },
    timeoutSeconds: 30,
});