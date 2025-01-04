import { defineFunction } from "@aws-amplify/backend";

export const fetchFromSource = defineFunction({
    name: "fetch-from-source-function",
    schedule: "every 15m",
    resourceGroupName: "data",
    timeoutSeconds: 30,
});