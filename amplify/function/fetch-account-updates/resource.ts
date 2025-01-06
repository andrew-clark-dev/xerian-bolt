import { defineFunction, secret } from "@aws-amplify/backend";
import { AxiosRequestConfig } from 'axios';

export const fetchAccountUpdatesFunction = defineFunction({
    name: "fetch-account-updates-function",
    // schedule: "every 15m",
    resourceGroupName: "data",
    timeoutSeconds: 10,
    environment: {  // environment variables
        API_KEY: secret('cc_api_key'),
        REQUEST_CONFIG: JSON.stringify({
            url: 'v1/accounts',
            baseURL: 'https://api.consigncloud.com/api/',
            params: {
                cursor: null,
                include: ['default_split', 'last_settlement', 'number_of_purchases', 'created_by', 'last_activity'],
                expand: ['created_by'],
                sort_by: 'created'
            }
        } as AxiosRequestConfig)
    },
})
