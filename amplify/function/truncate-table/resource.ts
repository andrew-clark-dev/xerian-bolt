import { defineFunction } from "@aws-amplify/backend";

export const truncateTableFunction = defineFunction({
    name: "truncate-table-function",
    resourceGroupName: "data",
});