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
import { importAccountsFunction } from './function/import-account/resource';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';

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
  importAccountsFunction,
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
const importAccountsLambda = backend.importAccountsFunction.resources.lambda;
backend.importAccountsFunction
// tables.Account.grantFullAccess(importAccountsLambda);
// tables.UserProfile.grantFullAccess(importAccountsLambda);
// bucket.grantReadWrite(importAccountsLambda);
bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(importAccountsLambda),
  {
    prefix: 'import/',
    suffix: '.csv',
  }
);

// Add S3 read policy for import
const readS3Policy = new PolicyStatement({
  sid: "AllowS3Access",
  actions: ["s3:GetObject", "s3:ListBucket"],
  resources: [`arn:aws:s3:::**`], // Replace with actual ARN
});

const allDdbPolicy = new PolicyStatement({
  sid: "AllowDDBAccess",
  actions: ["dynamodb:*"],
  resources: [`arn:aws:dynamodb:*:*:table/*`], // Replace with actual ARN
});

const allIndexPolicy = new PolicyStatement({
  sid: "AllowDDBIndexAccess",
  actions: ["dynamodb:DescribeTable", "dynamodb:Query", "dynamodb:Scan"],
  resources: ["arn:aws:dynamodb:*:*:table/*", "arn:aws:dynamodb:*:*:table/*/index/*"], // Replace with actual ARN
});


// Attach policy to allow access to all DynamoDB tables in the account
importAccountsLambda.addToRolePolicy(allDdbPolicy);
importAccountsLambda.addToRolePolicy(allIndexPolicy);
importAccountsLambda.addToRolePolicy(readS3Policy);
importAccountsLambda.addEnvironment("ACCOUNTS_TABLE_NAME", tables["Account"].tableName);


