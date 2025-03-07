import { defineFunction, secret } from "@aws-amplify/backend";

export const itemHookFunction = defineFunction({
    name: "item-hook-function",
    entry: "./hook.handler.ts",
    environment: {
        API_KEY: secret('API_KEY'),
        STORE_ID: secret('STORE_ID'),
    },
    timeoutSeconds: 30,
});

export const itemEventFunction = defineFunction({
    name: "item-event-function",
    entry: "./event.handler.ts",
    timeoutSeconds: 60,
});

