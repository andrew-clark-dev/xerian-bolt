import { defineFunction } from "@aws-amplify/backend";

export const truncateTableFunction = defineFunction({
    name: "truncate-table-function",
    resourceGroupName: "data",
    timeoutSeconds: 600 // 10 minute timeout
});