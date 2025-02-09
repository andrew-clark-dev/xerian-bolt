import { defineFunction, secret } from "@aws-amplify/backend";

export const fetchAccountsFunction = defineFunction({
    name: "fetch-account-function",
    entry: "./fetch.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    environment: {  // environment variables
        API_KEY: secret('CC_API_KEY'),
        BASE_URL: 'https://api.consigncloud.com/api',
        MESSAGE_GROUP_ID: 'account-fetch-group',
    },
});

export const importAccountFunction = defineFunction({
    name: "import-account-function",
    entry: "./import.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 5,
});