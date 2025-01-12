import { defineFunction, secret } from "@aws-amplify/backend";
import { AxiosRequestConfig } from 'axios';

export const fetchAccountUpdatesFunction = defineFunction({
    name: "fetch-items-function",
    // schedule: "every 15m",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    environment: {  // environment variables
        API_KEY: secret('cc_api_key'),
        REQUEST_CONFIG: JSON.stringify({
            url: 'v1/items',
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
