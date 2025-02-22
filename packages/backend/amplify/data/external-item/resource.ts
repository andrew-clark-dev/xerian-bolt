import { defineFunction, secret } from "@aws-amplify/backend";

export const findExternalItem = defineFunction({
    name: "find-external-item-function",
    entry: "./find.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 5,
    environment: {  // environment variables
        API_KEY: secret('CC_API_KEY'),
        BASE_URL: 'https://api.consigncloud.com/api/',
    },
})
