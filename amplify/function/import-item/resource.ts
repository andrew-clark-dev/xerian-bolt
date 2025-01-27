import { defineFunction, secret } from "@aws-amplify/backend";

export const fetchItemsFunction = defineFunction({
    name: "fetch-items-function",
    entry: "./fetch.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    environment: {  // environment variables
        API_KEY: secret('CC_API_KEY'),
        BASE_URL: 'https://api.consigncloud.com/api/',
    },
});

export const importItemFunction = defineFunction({
    name: "import-item-function",
    entry: "./import.handler.ts",
    resourceGroupName: "data",
    timeoutSeconds: 5,
});