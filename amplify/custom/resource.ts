import { Stack } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';


// NOT USED


export function defineSyncQueues(stack: Stack) {
    return {
        'account': new sqs.Queue(stack, 'AccountSyncQueue'),
        'ItemSyncQueue': new sqs.Queue(stack, 'ItemSyncQueue'),
        'CategorySyncQueue': new sqs.Queue(stack, 'CategorySyncQueue'),
        'SaleSyncQueue': new sqs.Queue(stack, 'SaleSyncQueue'),
    }
}
