import { defineFunction, secret } from "@aws-amplify/backend";
import { AxiosRequestConfig } from 'axios';

export const searchExternalAccount = defineFunction({
    name: "search-external-account-updates-function",
    entry: "./search.handler",
    resourceGroupName: "data",
    timeoutSeconds: 5,
    environment: {  // environment variables
        API_KEY: secret('cc_api_key'),
        REQUEST_CONFIG: JSON.stringify({
            url: 'v1/accounts',
            baseURL: 'https://api.consigncloud.com/api/',
            fetchParams: {
                cursor: null,
                include: ['default_split', 'last_settlement', 'number_of_purchases', 'created_by', 'last_activity'],
                expand: ['created_by'],
                sort_by: 'created'
            }
        } as AxiosRequestConfig)
    },
})
