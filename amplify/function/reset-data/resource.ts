import { defineFunction } from "@aws-amplify/backend";

export const resetDataFunction = defineFunction({
    name: "reset-data-function",
    resourceGroupName: "data",
    timeoutSeconds: 900, // 10 minute timeout
    memoryMB: 1024, // allocate 1024 MB of memory to the function.
    environment: {
        MODELS: JSON.stringify([
            ['Account', ['number']],
            ['Action', ['id']],
            ['Comment', ['id']],
            ['Item', ['sku']],
            ['Transaction', ['id']],
            ['ItemCategory', ['kind', 'name']],
            ['ItemGroup', ['id']],
        ])
    }
});