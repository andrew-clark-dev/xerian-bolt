import type { EventBridgeHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SQS } from 'aws-sdk';
import { accountClient, accountParams } from "../../lib/services/account.external.sevice";

const logger = new Logger({ serviceName: "fetch-external-accounts" });
const sqs = new SQS();
const queueUrl = process.env['QUEUE_URL']!;
const messageGroupId = process.env['MESSAGE_GROUP_ID']!;


export const handler: EventBridgeHandler<"Scheduled Event", null, { statusCode: number, body: string }> = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));

    try {
        const fetchParams = accountParams;
        do {
            const page = await accountClient.fetch(fetchParams);
            logger.info(`Processing fecthed page - total:  ${page.count}, pagesize : ${page?.data.length || 'None'} `);
            for (const account of page?.data || []) {
                const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify({
                        createdBy: account.created_by,
                        account: account,
                    }),
                    MessageGroupId: messageGroupId
                };
                try {
                    sqs.sendMessage(params, (err, data) => {
                        if (err) {
                            logger.error(`Error sending message to queue: ${account.id}`, err as Error);
                            throw err;
                        } else {
                            logger.info(`Message sent to queue: ${data.MessageId || 'No Id'} : ${data.SequenceNumber || 'No Sequance Number'}`);
                        }
                    });
                } catch (error) {
                    logger.error(`Error pushing item to queue: ${account.id}`, error as Error);
                    throw error;
                }

                fetchParams.cursor = page?.next_cursor || null;
            }
        } while (fetchParams.cursor);

        logger.info('Event processed successfully');
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
            }),
        };
    } catch (error) {

        logger.error(`Error fetching SyncData: ${JSON.stringify(error)}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching SyncData',
                error: (error instanceof Error) ? error.message : 'Unknown error',
            }),
        };
    }
};