import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue, DeadLetterQueue } from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';

export class SqsWithDlq extends cdk.Stack {
    public readonly queue: Queue; // Expose the queue as a public property
    public readonly dlq: DeadLetterQueue; // Expose the dlq as a public property

    constructor(scope: Construct, id: string, props: {
        queueName: string;
    }) {
        super(scope, id);

        // Define the Dead Letter Queue
        this.dlq = {
            maxReceiveCount: 5, // Number of processing attempts before moving to DLQ
            queue: new Queue(this, `${id}DeadLetterQueue`, {
                queueName: `${props.queueName.toLowerCase()}dlq.fifo`,
                deliveryDelay: Duration.millis(0),
                contentBasedDeduplication: true,
                retentionPeriod: Duration.days(14),
            }),
        };

        // Define the Queue with the DLQ
        this.queue = new Queue(this, `${id}Queue`, {
            queueName: `${props.queueName.toLowerCase()}.fifo`,
            visibilityTimeout: cdk.Duration.seconds(30), // Lock for 30 seconds during processing
            contentBasedDeduplication: true,
            fifo: true,
            deadLetterQueue: this.dlq,
        });



        // Outputs for debugging and integration
        new cdk.CfnOutput(this, 'DeadLetterQueueURL', {
            value: this.dlq.queue.queueUrl,
            description: 'URL of the Dead Letter Queue',
        });

        new cdk.CfnOutput(this, 'QueueURL', {
            value: this.queue.queueUrl,
            description: `URL of the ${props.queueName} SQS Queue`,
        });

    }
}