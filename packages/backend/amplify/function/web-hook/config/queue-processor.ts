import { Duration } from "aws-cdk-lib";
import { Backend } from "@aws-amplify/backend";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function createQueueProcessorWithRetries(backend: Backend<any>, lambda: IFunction) {
    const queueStack = backend.createStack("queue-stack");



    // Dead-Letter Queue (DLQ) to store messages that fail too many times
    const deadLetterQueue = new Queue(queueStack, "WebhookDLQ", {
        queueName: "WebhookDeadLetterQueue",
        retentionPeriod: Duration.days(14), // Retain failed messages for debugging
    });

    // Main Queue with a DLQ
    const queue = new Queue(queueStack, "WebhookQueue", {
        queueName: "WebhookProcessingQueue",
        visibilityTimeout: Duration.seconds(30), // Time before retry
        deadLetterQueue: {
            queue: deadLetterQueue,
            maxReceiveCount: 3, // Retry up to 3 times before sending to DLQ
        },
    });

    // Grant Lambda permission to process messages
    queue.grantConsumeMessages(lambda);

    // Attach SQS as an event source for Lambda
    lambda.addEventSource(new SqsEventSource(queue));

    // Add IAM permissions for Lambda to access SQS
    lambda.addToRolePolicy(
        new PolicyStatement({
            actions: ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
            resources: [queue.queueArn],
        })
    );

    // Output the queue URL
    backend.addOutput({
        custom: {
            Queue: {
                queueUrl: queue.queueUrl,
                queueArn: queue.queueArn,
                deadLetterQueueUrl: deadLetterQueue.queueUrl,
                deadLetterQueueArn: deadLetterQueue.queueArn,
            },
        },
    });

    return queue;
}
