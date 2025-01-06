import { apiClient, ExternalItemPage } from '../lib/api/client';


import { Logger } from "@aws-lambda-powertools/logger";
import AWS from 'aws-sdk';


const sqs = new AWS.SQS();

const logger = new Logger({ serviceName: "fetch-from-source" });

export interface ExternalAccount {
  id: string,
  number: string,
  last_activity?: string,
  created: string,
  created_by: { id: string, name: string, user_type: string },
  first_name: string | null,
  last_name: string | null,
  email: string | null,
  phone_number: string | null,
  address_line_1: string | null,
  address_line_2: string | null,
  city: string | null,
  state: string | null,
  postal_code: string | null,
  default_split?: number,
  balance: number,
}

export async function fetchNewData(lastSync: Date): Promise<void> {

  let processed = 0;
  let failed = 0;
  let cursor: string | null = null;

  try {

    do {
      const page: ExternalItemPage<ExternalAccount> = await apiClient.fetch<ExternalAccount>(cursor);

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
        } catch (error) {
          logger.error(`Error pushing item to queue: ${item.id}`, error as Error);
          failed++;
        }
      }



      cursor = page.next_cursor;

    } while (cursor);

    logger.info(`Finished importing Accounts - processed: ${processed}, failed: ${failed}`);

  } catch (error) {
    logger.error(`Error importing Accounts: ${error}`);
    throw error;
  }
}



