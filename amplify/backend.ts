import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createActionFunction } from './function/create-action/resource';
import { findExternalAccount } from './data/external-account/resource';
import { truncateTableFunction } from './function/truncate-table/resource';
import { resetDataFunction } from './function/reset-data/resource';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { importReceiveFunction, importAccountFunction, importItemFunction, IMPORT_DIRS, importSaleFunction } from './data/import/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  createActionFunction,
  findExternalAccount,
  truncateTableFunction,
  resetDataFunction,
  importAccountFunction,
  importItemFunction,
  importReceiveFunction,
  importSaleFunction,
});

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// modify cfnUserPool policies directly
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 20,
    requireLowercase: false,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: false,
    temporaryPasswordValidityDays: 20,
  },
};



const { tables } = backend.data.resources
const { bucket } = backend.storage.resources
// const region = backend.stack.region
// const accountId = backend.stack.account


const createActionLambda = backend.createActionFunction.resources.lambda
tables["Counter"].grantFullAccess(createActionLambda);

const policy = new Policy(
  Stack.of(createActionLambda),
  "createActionFunctionStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);

createActionLambda.role?.attachInlinePolicy(policy);
backend.createActionFunction.addEnvironment("COUNTER_TABLE_NAME", tables["Counter"].tableName);

const accountMapping = new EventSourceMapping(
  Stack.of(tables["Account"]),
  "createActionAccountEventStreamMapping",
  {
    target: createActionLambda,
    eventSourceArn: tables["Account"].tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

accountMapping.node.addDependency(policy);

const itemMapping = new EventSourceMapping(
  Stack.of(tables["Item"]),
  "createActionItemEventStreamMapping",
  {
    target: createActionLambda,
    eventSourceArn: tables["Item"].tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

itemMapping.node.addDependency(policy);

const saleMapping = new EventSourceMapping(
  Stack.of(tables["Sale"]),
  "createActionSaleEventStreamMapping",
  {
    target: createActionLambda,
    eventSourceArn: tables["Sale"].tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

saleMapping.node.addDependency(policy);

const transactionMapping = new EventSourceMapping(
  Stack.of(tables["Transaction"]),
  "createActionTransactionEventStreamMapping",
  {
    target: createActionLambda,
    eventSourceArn: tables["Transaction"].tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

transactionMapping.node.addDependency(policy);


// Extend add environment and access for table functions
for (const key in tables) {
  const t = tables[key];
  backend.truncateTableFunction.addEnvironment(`${key.toUpperCase()}_TABLE`, t.tableName)
  backend.resetDataFunction.addEnvironment(`${key.toUpperCase()}_TABLE`, t.tableName)
  t.grantFullAccess(backend.truncateTableFunction.resources.lambda);
  t.grantFullAccess(backend.resetDataFunction.resources.lambda);
}

// Set up import queues and integrate with Lambda functions
const importAccountLambda = backend.importAccountFunction.resources.lambda;
const importItemLambda = backend.importItemFunction.resources.lambda;
const importReceiveLambda = backend.importReceiveFunction.resources.lambda;
const imporSaleLambda = backend.importSaleFunction.resources.lambda;

bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(importReceiveLambda),
  { prefix: IMPORT_DIRS.IN_DIR, suffix: '.csv' }
);

bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(importAccountLambda),
  { prefix: IMPORT_DIRS.PROCESSING_DIR + 'Account', suffix: '.csv' }
);

bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(importItemLambda),
  { prefix: IMPORT_DIRS.PROCESSING_DIR + 'Item', suffix: '.csv' }
);

bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(imporSaleLambda),
  { prefix: IMPORT_DIRS.PROCESSING_DIR + 'Sale', suffix: '.csv' }
);

