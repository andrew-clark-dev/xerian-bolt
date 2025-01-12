import { defineFunction } from "@aws-amplify/backend";

export const importAccountFunction = defineFunction({
    name: "import-account-function",
    resourceGroupName: "data",
    timeoutSeconds: 120,
});