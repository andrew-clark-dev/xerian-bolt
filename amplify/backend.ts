import { defineBackend } from '@aws-amplify/backend';
// import { Stack } from 'aws-cdk-lib';
// import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
// import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
// import { createActionFunction } from './function/create-action/resource';
// import { truncateTableFunction } from './function/truncate-table/resource';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
// import { importAccountFunction } from './function/import-account/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  // createActionFunction,
  // truncateTableFunction,
  // importAccountFunction
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

// const { tables } = backend.data.resources

// const createActionLambda = backend.createActionFunction.resources.lambda
// tables["Counter"].grantFullAccess(createActionLambda);

// const policy = new Policy(
//   Stack.of(createActionLambda),
//   "createActionFunctionStreamingPolicy",
//   {
//     statements: [
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         actions: [
//           "dynamodb:DescribeStream",
//           "dynamodb:GetRecords",
//           "dynamodb:GetShardIterator",
//           "dynamodb:ListStreams",
//         ],
//         resources: ["*"],
//       }),
//     ],
//   }
// );

// createActionLambda.role?.attachInlinePolicy(policy);
// backend.createActionFunction.addEnvironment("COUNTER_TABLE_NAME", tables["Counter"].tableName);

// const accountMapping = new EventSourceMapping(
//   Stack.of(tables["Account"]),
//   "createActionAccountEventStreamMapping",
//   {
//     target: createActionLambda,
//     eventSourceArn: tables["Account"].tableStreamArn,
//     startingPosition: StartingPosition.LATEST,
//   }
// );

// accountMapping.node.addDependency(policy);

// const itemMapping = new EventSourceMapping(
//   Stack.of(tables["Item"]),
//   "createActionItemEventStreamMapping",
//   {
//     target: createActionLambda,
//     eventSourceArn: tables["Item"].tableStreamArn,
//     startingPosition: StartingPosition.LATEST,
//   }
// );

// itemMapping.node.addDependency(policy);

// const transactionMapping = new EventSourceMapping(
//   Stack.of(tables["Transaction"]),
//   "createActionTransactionEventStreamMapping",
//   {
//     target: createActionLambda,
//     eventSourceArn: tables["Transaction"].tableStreamArn,
//     startingPosition: StartingPosition.LATEST,
//   }
// );

// transactionMapping.node.addDependency(policy);


// // Extend ENV for truncateTable
// for (const key in tables) {
//   const t = tables[key];
//   backend.truncateTableFunction.addEnvironment(`${key.toUpperCase()}_TABLE`, t.tableName)
//   t.grantFullAccess(backend.truncateTableFunction.resources.lambda);
// }



// Set up account import queue and grant permissions to importAccountFunction
// const customStack = backend.createStack('CustomResources');

// const acountImportQueue = new sqs.Queue(customStack, `AcountImportQueue`);
// backend.fetchAccountUpdatesFunction.addEnvironment(`IMPORT_QUEUE_URL`, acountImportQueue.queueUrl);
// acountImportQueue.grantSendMessages(backend.fetchAccountUpdatesFunction.resources.lambda);
// backend.importAccountFunction.resources.lambda.addEventSource(new SqsEventSource(acountImportQueue));
// tables['Account'].grantFullAccess(backend.importAccountFunction.resources.lambda);
// tables['UserProfile'].grantFullAccess(backend.importAccountFunction.resources.lambda);
// tables['Action'].grantFullAccess(backend.importAccountFunction.resources.lambda);

