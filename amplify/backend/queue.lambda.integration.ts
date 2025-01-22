import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { SqsWithDlq } from './sqs';
import { DeadLetterQueue, Queue } from 'aws-cdk-lib/aws-sqs';

/**
 * A construct that sets up a Lambda function and an SQS Queue
 * with permissions and event source mapping.
 */
export class QueueLambdaIntegration extends Construct {

  public readonly queue: Queue; // Expose the queue as a public property
  public readonly dlq: DeadLetterQueue; // Expose the dlq as a public property

  constructor(scope: Construct, id: string, props: {
    queueName: string;
    sendFunction: lambda.Function;
    receiveFunction: lambda.Function;
    tables: ITable[];
  }) {
    super(scope, id);

    // Step 1: Create an SQS Queue
    const q = new SqsWithDlq(this, `${id}QueueWithDlq`, {
      queueName: props.queueName,

    });

    // Step 2: Add environment variables to Lambda functions
    props.sendFunction.addEnvironment('QUEUE_URL', q.queue.queueUrl);

    // Step 3: Grant the Lambda functions permissions to interact with the SQS Queue
    q.queue.grantSendMessages(props.sendFunction);
    q.queue.grantConsumeMessages(props.receiveFunction);

    // Step 4: Set up event source for the importAccountLambda
    props.receiveFunction.addEventSource(new SqsEventSource(q.queue));

    // Step 5: Grant the Lambda functions permissions to interact with the DynamoDB tables
    for (const table of props.tables) {
      table.grantFullAccess(props.sendFunction);
      table.grantFullAccess(props.receiveFunction);
    }

    this.queue = q.queue;
    this.dlq = q.dlq;

  }
}
