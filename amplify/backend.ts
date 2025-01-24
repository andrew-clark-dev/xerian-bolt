import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping, Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createActionFunction } from './function/create-action/resource';
import { findExternalAccount } from './data/external-account/resource';
import { truncateTableFunction } from './function/truncate-table/resource';
import { fetchAccountsFunction, importAccountFunction } from './function/sync-account/resource';
import { fetchItemsFunction, importItemFunction } from './function/import-item/resource';
import { QueueLambdaIntegration } from './backend/queue.lambda.integration';
import { resetDataFunction } from './function/reset-data/resource';


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
  fetchAccountsFunction,
  importAccountFunction,
  fetchItemsFunction,
  importItemFunction,
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
const customStack = backend.createStack('CustomResources');

// Get the Lambda function objects
const fetchAccountsLambda = backend.fetchAccountsFunction.resources.lambda;
const importAccountLambda = backend.importAccountFunction.resources.lambda;

// Create the Queue-Lambda integration construct
new QueueLambdaIntegration(customStack, 'AccountImportIntegration', {
  queueName: 'AccountImport',
  sendFunction: fetchAccountsLambda as LambdaFunction,
  receiveFunction: importAccountLambda as LambdaFunction,
  tables: [tables['Account'], tables['UserProfile'], tables['Action']],
});

// Get the Lambda function objects
const fetchItemsLambda = backend.fetchItemsFunction.resources.lambda;
const importItemLambda = backend.importItemFunction.resources.lambda;

// Create the Queue-Lambda integration construct
new QueueLambdaIntegration(customStack, 'ItemImportIntegration', {
  queueName: 'ItemImport',
  sendFunction: fetchItemsLambda as LambdaFunction,
  receiveFunction: importItemLambda as LambdaFunction,
  tables: [tables['Item'], tables['UserProfile'], tables['Action']],
});


// const fetchAccountsLambda = backend.fetchAccountsFunction.resources.lambda;
// const importAccountLambda = backend.importAccountFunction.resources.lambda;

// backend.fetchAccountsFunction.addEnvironment(`QUEUE_URL`, queues.itemImportQueue.queueUrl);
// queues.accountImportQueue.grantSendMessages(fetchAccountsLambda);
// importAccountLambda.addEventSource(new SqsEventSource(queues.accountImportQueue));
// queues.accountImportQueue.grantConsumeMessages(importAccountLambda);

// tables['Account'].grantFullAccess(importAccountLambda);
// tables['UserProfile'].grantFullAccess(importAccountLambda);
// tables['Action'].grantFullAccess(importAccountLambda);

// const fetchItemsLambda = backend.fetchItemsFunction.resources.lambda;
// const importItemLambda = backend.importItemFunction.resources.lambda;

// backend.fetchItemsFunction.addEnvironment(`QUEUE_URL`, queues.itemImportQueue.queueUrl);
// queues.itemImportQueue.grantSendMessages(fetchItemsLambda);
// importItemLambda.addEventSource(new SqsEventSource(queues.itemImportQueue));
// queues.itemImportQueue.grantConsumeMessages(importItemLambda);

// tables['Item'].grantFullAccess(importItemLambda);
// tables['UserProfile'].grantFullAccess(importItemLambda);
// tables['Action'].grantFullAccess(importItemLambda);