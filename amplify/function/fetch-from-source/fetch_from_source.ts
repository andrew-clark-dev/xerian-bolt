import { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { type Schema } from "../../data/resource";

import { Logger } from "@aws-lambda-powertools/logger";
import AWS from 'aws-sdk';
import { Context } from 'aws-lambda';

export type SyncData = Schema['SyncData']['type'];

const sqs = new AWS.SQS();

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "fetch-from-source",
});

export interface ExternalUser {
  id: string;
  name: string;
  user_type: string;
}

export interface ExternalItem {
  id: string;
  created_by: ExternalUser;
}

export interface ExternalItemPage {
  count: number;
  data: ExternalItem[];
  next_cursor: string | null;
}

async function fetchItems(requestConfig: AxiosRequestConfig): Promise<ExternalItemPage> {
  try {

    return await apiClient.get<ExternalItemPage>(requestConfig.url!, requestConfig);

  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response);
      if (error.response?.status == 429) {
        // Too many requests, wait and try again
        console.log("Too many requests, wait and try again");
        await new Promise(resolve => setTimeout(resolve, 5000));
        return fetchItems(requestConfig);
      }
      console.error(`AxiosError (${error.response?.status}) in fetchItems:`, error);
    }
    throw error;
  }
}

export async function fetchNewData(context: Context, token: string, data: SyncData[]): Promise<SyncData[]> {

  const result: SyncData[] = [];

  apiClient.setAuthToken(token);

  let processed = 0;
  let failed = 0;
  // const errors: Error[] = [];


  try {

    for (const syncData of data) {
      logger.info(`Synchronise: ${syncData.interface.toString}`);

      const requestConfig: AxiosRequestConfig = {
        url: syncData.parameters.path,
        params: {
          cursor: null,
          includes: syncData.parameters.includes,
          expands: syncData.parameters.expands,
          'created:gte': syncData.lastSync,
        }
      }

      do {
        logger.info(`Fetching items with cursor: ${requestConfig.params.cursor}`);
        const page = await fetchItems(requestConfig);

        logger.info(`Page fetched ${page.data.length} items, total ${page.count}, next cursor: ${page.next_cursor}`);


        for (const item of page.data) {
          logger.info(`Processing item: ${item.id}`);

          const params = {
            QueueUrl: process.env[`SYNC_QUEUE_URL_FOR_${syncData.interface.toUpperCase()}`]!,
            MessageBody: JSON.stringify({
              // Your message payload
              key: 'value'
            }),
          };
          try {
            sqs.sendMessage(params, (err, data) => {
              if (err) {
                logger.error(`Error sending message to queue: ${item.id}`, err as Error);
                failed++;
              } else {
                logger.info(`Message sent to queue: ${data.MessageId || 'No Id!'} : ${data.SequenceNumber || 'No Sequance Number!'}`);
              }
            });

            processed++;
          } catch (error) {
            logger.error(`Error pushing item to queue: ${item.id}`, error as Error);
            failed++;
          }
        }

        // Check remaining time
        const remainingTime = context.getRemainingTimeInMillis();
        if (remainingTime < 10000) {
          logger.warn(`Remaining time is less than 10 seconds, exiting loop`);
          break;
        }

        requestConfig.params.cursor = page.next_cursor;

      } while (requestConfig.params.cursor);

      logger.info(`Finished processing items for ${syncData.interface.toString}`);

      result.push({
        ...syncData,
        log: {
          syncTime: new Date().toISOString(),
          recieved: processed + failed,
          processed: 0,
          failed: failed,
        },
        history: [...(syncData.history ?? []), syncData.log],
      });
    }

    return result;

  } catch (error) {
    console.error('Error importing items:', error);
    throw error;
  }
}



