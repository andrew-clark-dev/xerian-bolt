import type { S3Handler } from "aws-lambda";
import { type Schema } from "../resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-item-function";
import AWS from "aws-sdk";
import Papa from "papaparse";
import { provisionService } from "../../lib/services/user.external.sevice";
import { importUserId } from "../../lib/services/table.sevice";
import { archiveFile, writeErrorFile } from "./handler.receive";
import { logger } from "../../lib/logger";
import { toISO } from "../../lib/util";
import { v4 as uuidv4 } from 'uuid';
export type Sale = Schema['Sale']['type']
export type Transaction = Schema['Transaction']['type']
export type PaymentType = Schema['Transaction']['type']['paymentType'];

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// Initialize AWS clients
const s3 = new AWS.S3();

interface Row {
    'Number': string,
    'Status': string,
    'Memo': string,
    'Customer': string,
    'Customer Name': string,
    'Customer Company': string,
    'Cashier': string,
    'Created': string,
    'Finalized': string,
    'Parked': string,
    'Voided': string,
    'Gross': string,
    'Subtotal': string,
    'Total': string,
    'Change': string,
    'COGS': string,
    'Consignor Portion': string,
    'Store Portion': string,
    'Check Payments': string,
    'Cash Payments': string,
    'Credit Card Payments': string,
    'Store Credit Payments': string,
    'Gift Card Payments': string,
    'Manual Payments': string,
    'Refund Amount': string,
    'SKUs': string,
    'MWST': string,
}


/**
 * Lambda Handler Function
 */
export const handler: S3Handler = async (event): Promise<void> => {
    logger.info('S3 event:', event);
    try {
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        // Get the file from S3
        logger.info(`Get: ${key} from ${bucket}`);
        const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        if (!s3Object.Body) {
            throw new Error("File is empty or not accessible.");
        }

        // Parse CSV data
        const csvContent = s3Object.Body.toString("utf-8");
        const { data } = Papa.parse<Row>(csvContent, { header: true });

        // Insert data into DynamoDB
        let errorCount = 0;
        let added = 0;
        let skipped = 0;
        for (const row of data) {
            const nickname = row['Cashier']
            const profile = await provisionService.provisionUserByName(nickname);
            try {
                const processed = await createSale(row, profile.id);
                added += processed;
                skipped += (1 - processed);
            } catch (error) {
                logger.error('Error creating item', error);
                errorCount++;
                writeErrorFile(bucket, key, row, profile.id, error);
                throw error;
            }
        }

        logger.info(`Successfully processed ${data.length} items, ${added} added, ${skipped} skipped, with ${errorCount} errors`);

        // Move the file to the archive folder 
        await archiveFile(bucket, key);

    } catch (error) {
        logger.ifErrorThrow(`Error processing CSV `, error);
    }
};

async function createSale(row: Row, id: string): Promise<number> {
    logger.info('Process', row);
    const sale = await client.models.Sale.get({ number: row['Number'] });
    if (sale.data) {
        logger.info(`Sale already exists:`, sale.data);
        return 0;
    }

    const refundAmount = money(row['Refund Amount']);

    const transactionType = (refundAmount > 0) ? 'Refund' : 'Sale';

    const newTransaction: Transaction = {
        id: uuidv4(),
        lastActivityBy: importUserId,
        paymentType: paymentType(row),
        type: transactionType,
        amount: money(row.Total),
        tax: money(row['MWST'].replace('CHF', '')),
        status: 'Completed',
    }

    logger.info(`Creating transaction`, newTransaction);

    const { data: transaction, errors: transactionErrors } = await client.models.Transaction.create(newTransaction);

    logger.ifErrorThrow(`Failed to create transaction for sale: ${row['Number']}`, transactionErrors);

    logger.info('Created transaction', transaction);

    const newSale = {
        id: uuidv4(),
        number: row['Number'],
        lastActivityBy: id,
        status: 'Finalized' as const,
        gross: money(row['Gross']),
        subTotal: money(row['Subtotal']),
        total: money(row['Total']),
        change: money(row['Change']),
        accountTotal: money(row['Consignor Portion']),
        storeTotal: money(row['Store Portion']),
        transaction: transaction!.id,
        createdAt: toISO(row['Created']),
        updatedAt: toISO(row['Finalized']),
        tax: money(row['MWST'].replace('CHF', '')), // Add tax property
    }

    logger.info(`Creating sale : ${JSON.stringify(newSale)}`);

    const { data, errors } = await client.models.Sale.create(newSale);

    logger.ifErrorThrow('Failed to create sale ', errors);

    logger.info('Created sale', data);

    row['SKUs'].split(',').forEach(async (sku) => {
        logger.info(`Creating item link : ${sku}`);

        const { data: conectData, errors: connectErrors } = await client.models.SaleItem.create({
            itemSku: sku,
            saleNumber: data!.number,
        });

        logger.ifErrorThrow('Failed to create item link ', connectErrors);
        logger.info('Created item link', conectData);
    });


    logger.info(`Creating sale import action: ${data?.number}`);
    const { errors: actionErrors } = await client.models.Action.create({
        description: `Import of sale`,
        modelName: "Sale",
        type: "Import",
        typeIndex: "Import",
        refId: data?.id,
        userId: importUserId,
    });
    logger.ifErrorThrow('Failed to create item action', actionErrors);

    return 1;
}

function money(text?: string | null): number {
    if (!text) {
        return 0;
    }
    return Math.round(parseFloat(text) * 100);
}

function paymentType(row: Row): PaymentType {
    if (money(row["Cash Payments"]) > 0) { return "Cash"; }
    if (money(row["Credit Card Payments"]) > 0) { return "Card"; }
    if (money(row["Store Credit Payments"]) > 0) { return "StoreCredit"; }
    if (money(row["Gift Card Payments"]) > 0) { return "GiftCard"; }
    return 'Other'
}