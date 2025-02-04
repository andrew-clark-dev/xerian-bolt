import { Logger } from "@aws-lambda-powertools/logger";
import { SQS } from 'aws-sdk';
import { paged } from "../../lib/services/item.external.sevice";
import { Context } from 'aws-lambda';
import { readParameter, writeParameter } from "../../lib/services/table.sevice";
import { unknownExternalUser } from "../../lib/services/table.sevice";

const PARAMETER_NAME = 'imported_items_up_to';
const BEGINING = new Date(2000, 1, 1).toISOString()
const logger = new Logger({ serviceName: "fetch-external-items" });
const sqs = new SQS();
const queueUrl = process.env['QUEUE_URL']!;

// Threshold to exit early (e.g., 5000 ms = 15 seconds)
const threshold = 15000;
let earlyExit = false;


export const handler = async (event: unknown, context: Context) => {
    logger.info("event", JSON.stringify(event, null, 2));
    logger.info(`Get param: ${PARAMETER_NAME}`);

    let upTo: string = await readParameter(PARAMETER_NAME, BEGINING) || BEGINING;

    try {

        const from = upTo;
        logger.info(`upTo: ${upTo}`);

        let cursor: string | null = null;
        let pageNumer = 0;

        do {
            const page = await paged(cursor, from);
            logger.info(`Processing fetched page. ${++pageNumer} - total: ${page.count}, pagesize : ${page?.data.length || 'None'} `);
            for (const item of page?.data || []) {
                logger.info(`Send item: ${item.sku}, message to queue : ${queueUrl} - created by ${item.created_by?.name || 'undefined'} - ${item.created_by?.id || 'undefined'}`);
                if (!item.created_by?.id) {
                    logger.warn(`Account created by unknown user: ${item.sku}`);
                    item.created_by = unknownExternalUser;
                } const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify({
                        createdBy: item.created_by,
                        item: item,
                    })
                };
                try {
                    sqs.sendMessage(params, (err, data) => {
                        if (err) {
                            logger.error(`Error sending message to queue: ${item.id}`, err as Error);
                        } else {
                            logger.info(`Message sent to queue: ${data.MessageId || 'No Id'} : ${data.SequenceNumber || 'No Sequance Number'}`);
                        }
                    });
                } catch (error) {
                    logger.error(`Error pushing item to queue: ${item.id}`, error as Error);
                }
                upTo = item.created;
            }
            cursor = page?.next_cursor || null;

            const remainingTime = context.getRemainingTimeInMillis();
            earlyExit = remainingTime < threshold;

        } while (cursor && !earlyExit);

        if (earlyExit) { logger.warn(`Early exit triggered.`) }

        logger.info(`Writing upto : ${upTo} to parameter store`);
        await writeParameter(PARAMETER_NAME, upTo);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
            }),
        };
    } catch (error) {

        logger.error(`Error fetching Items: ${JSON.stringify(error)}`);
        logger.info(`Writing upto : ${upTo} to parameter store`);
        await writeParameter(PARAMETER_NAME, upTo);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching Items',
                error: (error instanceof Error) ? error.message : 'Unknown error',
            }),
        };
    }
};