import { defineBackend } from '@aws-amplify/backend';
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createActionFunction } from './function/create-action/resource';
import { truncateTableFunction } from './function/truncate-table/resource';
import { Stack } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  createActionFunction,
  truncateTableFunction,
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

const counterTable = backend.data.resources.tables["Counter"];
counterTable.grantFullAccess(backend.createActionFunction.resources.lambda);

const accountTable = backend.data.resources.tables["Account"];
const policy = new Policy(
  Stack.of(accountTable),
  "AccountDBFunctionStreamingPolicy",
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

backend.createActionFunction.resources.lambda.role?.attachInlinePolicy(policy);
backend.createActionFunction.addEnvironment("COUNTER_TABLE_NAME", counterTable.tableName);

const mapping = new EventSourceMapping(
  Stack.of(accountTable),
  "DBFunctionAccountEventStreamMapping",
  {
    target: backend.createActionFunction.resources.lambda,
    eventSourceArn: accountTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

mapping.node.addDependency(policy);


// Extend ENV for truncateTable
for (const key in tables) {
  const t = tables[key];
  backend.truncateTableFunction.addEnvironment(`${key.toUpperCase()}_TABLE`, t.tableName)
  t.grantFullAccess(backend.truncateTableFunction.resources.lambda);
}