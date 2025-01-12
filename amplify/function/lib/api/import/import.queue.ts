
import { Logger } from "@aws-lambda-powertools/logger";
import AWS from 'aws-sdk';

const sqs = new AWS.SQS();

const logger = new Logger({ serviceName: "fetch-from-source" });

export interface ImportMessage {
    createdById: string,
    data: ExternalItem,
}



export class ImportQueue {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    async send(message: ImportMessage): Promise<void> {
        const params = {
            QueueUrl: this.url,
            MessageBody: JSON.stringify(message),
        };

        try {
            sqs.sendMessage(params, (err, data) => {
                if (err) {
                    logger.error(`Error sending message to queue: ${message}`, err as Error);
                } else {
                    logger.info(`Message sent to queue: ${data.MessageId || 'No Id'} : ${data.SequenceNumber || 'No Sequance Number'}`);
                }
            });

        } catch (error) {
            logger.error(`Error sending message to queue: ${message}`, error as Error);
            throw error;
        }
    }
}

export async function fetchNewData(lastSync: Date): Promise<void> {

    let processed = 0;
    let failed = 0;
    let cursor: string | null = null;

    try {

        do {
            const page: ExternalPage<External> = await apiClient.fetch<External>(cursor);

            logger.info(`Page fetched ${page.data.length} items, total ${page.count}, next cursor: ${page.next_cursor}`);

            for (const item of page.data) {
                const lastActivity = new Date(item.last_activity ?? item.created);
                if (lastActivity <= lastSync) {
                    logger.info(`Skipping item: ${item.id} - last activity: ${lastActivity.toISOString()}`);
                    continue;
                }
                logger.info(`Processing item: ${item.id}`);

                const params = {
                    QueueUrl: process.env['IMPORT_QUEUE_URL']!,
                    MessageBody: JSON.stringify({
                        createdById: item.created_by.id,
                        account: item,
                    }),
                };

                try {
                    sqs.sendMessage(params, (err, data) => {
                        if (err) {
                            logger.error(`Error sending message to queue: ${item.id}`, err as Error);
                            failed++;
                        } else {
                            logger.info(`Message sent to queue: ${data.MessageId || 'No Id'} : ${data.SequenceNumber || 'No Sequance Number'}`);
                        }
                    });

                    processed++;
                    logger.info(`Processed : ${processed} of ${page.count}`);

                } catch (error) {
                    logger.error(`Error pushing item to queue: ${item.id}`, error as Error);
                    failed++;
                }
            }



            cursor = page.next_cursor;

            if (processed > 50) { break; }

        } while (cursor);

        logger.info(`Finished importing Accounts - processed: ${processed}, failed: ${failed}`);

    } catch (error) {
        logger.error(`Error importing Accounts: ${error}`);
        throw error;
    }
}



