import { Logger } from "@aws-lambda-powertools/logger";
import { SQS } from 'aws-sdk';
import { paged } from "../../lib/services/account.external.sevice";
import { unknownExternalUser } from "../../lib/services/table.sevice";

const logger = new Logger({ serviceName: "fetch-external-accounts" });
const sqs = new SQS();
const queueUrl = process.env['QUEUE_URL']!;
const messageGroupId = process.env['MESSAGE_GROUP_ID']!;

export const handler = async (event: unknown) => {
    logger.info("event", JSON.stringify(event, null, 2));

    try {
        let cursor: string | null = null;
        let pageNumer = 0;
        do {
            const page = await paged(cursor);
            logger.info(`Processing fetched page. ${++pageNumer} - total: ${page.count}, pagesize : ${page?.data.length || 'None'} `);
            for (const account of page?.data || []) {
                logger.info(`Send account: ${account.number}, message to queue : ${queueUrl} - created by ${account.created_by?.name || 'undefined'} - ${account.created_by?.id || 'undefined'}`);
                if (!account.created_by?.id) {
                    logger.warn(`Account created by unknown user: ${account.number}`);
                    account.created_by = unknownExternalUser;
                }
                const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify({
                        createdBy: account.created_by,
                        account: account,
                    }),
                    MessageGroupId: messageGroupId
                };
                try {
                    const data = await sqs.sendMessage(params).promise();
                    logger.info(`Message sent to queue: id ${data.MessageId || 'No Id'} - seq ${data.SequenceNumber || 'No Sequence Number'}`);
                } catch (error) {
                    logger.error(`Error pushing item to queue: ${account.id}`, error as Error);
                    throw error;
                }

            }
            cursor = page?.next_cursor;
        } while (cursor);

        logger.info('Event processed successfully');
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
            }),
        };
    } catch (error) {

        logger.error(`Error fetching accounts from external source: ${JSON.stringify(error)}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching accounts from external source',
                error: (error instanceof Error) ? error.message : 'Unknown error',
            }),
        };
    }
};