import { defineFunction } from "@aws-amplify/backend";

export const IMPORT_DIR = 'import/'
export const PROCESSING_DIR = 'import/processing/'
export const ARCHIVE_DIR = 'import/archive/'

export const importAccountFunction = defineFunction({
    name: "import-account-function",
    entry: "./handler.account.ts",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    environment: {  // Environment variables are passed to the function 
        ARCHIVE_DIR: ARCHIVE_DIR,
    },
});

export const importItemFunction = defineFunction({
    name: "import-item-function",
    entry: "./handler.item.ts",
    resourceGroupName: "data",
    timeoutSeconds: 900,
    environment: {  // Environment variables are passed to the function 
        ARCHIVE_DIR: ARCHIVE_DIR,
    },
});

export const importReceiveFunction = defineFunction({
    name: "import-receive-function",
    entry: "./handler.receive.ts",
    resourceGroupName: "data",
    timeoutSeconds: 120,
    environment: {  // Environment variables are passed to the function 
        MAX_LINES: "1000",
        OUTPUT_DIR: PROCESSING_DIR,
        ARCHIVE_DIR: ARCHIVE_DIR,
    },
});