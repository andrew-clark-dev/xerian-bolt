import { defineFunction, secret } from "@aws-amplify/backend";

export const fetchAccountsFunction = defineFunction({
    name: "fetch-account-function",
    entry: "./fetch.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    schedule: "every day",
    environment: {  // environment variables
        API_KEY: secret('CC_API_KEY'),
        BASE_URL: 'https://api.consigncloud.com/api/',
    },
});

export const importAccountFunction = defineFunction({
    name: "import-account-function",
    entry: "./import.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 5,
});