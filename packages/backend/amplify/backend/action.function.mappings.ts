import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { EventSourceMapping, IFunction, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

export class ActionFunctionMappings extends cdk.Stack {

    constructor(scope: Construct, id: string, props: {
        tables: { [key: string]: ITable };
        createActionFunction: IFunction;
    }) {
        super(scope, id);

        const createActionFunctionStreamingPolicy = new Policy(
            Stack.of(props.createActionFunction),
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

        props.createActionFunction.role?.attachInlinePolicy(createActionFunctionStreamingPolicy);
        (props.createActionFunction as lambda.Function).addEnvironment("COUNTER_TABLE_NAME", props.tables["Counter"].tableName);


        ["Account", "Item", "Sale", "Transaction", "ItemCategory", "Comment"].forEach((tableName: string) => {
            const mapping = new EventSourceMapping(
                Stack.of(props.tables[tableName]),
                "createAction" + tableName + "EventStreamMapping",
                {
                    target: props.createActionFunction,
                    eventSourceArn: props.tables[tableName].tableStreamArn,
                    startingPosition: StartingPosition.LATEST,
                }
            );
            mapping.node.addDependency(createActionFunctionStreamingPolicy);
        });

    }
}