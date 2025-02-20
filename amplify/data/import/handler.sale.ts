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
import { archiveFile, money, writeErrorFile } from "./handler.receive";
import { logger } from "../../lib/logger";
import { toISO } from "../../lib/util";
import { v4 as uuidv4 } from 'uuid';
import { toSaleItem } from "../../lib/services/item.external.sevice";
export type Sale = Schema['Sale']['type']
export type SaleItem = Schema['SaleItem']['type']
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
    '100000 (deleted 18 Feb 2020)': string,
    'Staff Discount': string,
    '25% Vitrine discount (deleted 17 Aug 2020)': string,
    '50%': string,
    'Summer Sale (deleted 17 Aug 2020)': string,
    '50%  Alte Kleider Sale (deleted 19 Jul 2022)': string,
    'Markenkleider (deleted 17 Aug 2020)': string,
    '10 % sale (deleted 21 Feb 2022)': string,
    'sale 25% (deleted 17 Mar 2022)': string,
    '50% (deleted 25 Feb 2022)': string
    'Petit Etoile 20% (deleted 17 Mar 2022)': string,
    'Markenkleider SALE': string,
    'Alte Markenschue': string,
    'Wollbefinden (deleted 2 Feb 2023)': string,
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

    logger.info('Get sale items');

    const saleItems: SaleItem[] = await Promise.all(row['SKUs'].split(',').map(async (sku) => {
        const item = await client.models.Item.get({ sku });
        if (!item.data) {
            logger.error(`Item not found: ${sku}`);
            return null;
        }
        logger.info(`Update item with sale: ${sku}`);
        const sales = new Set(item.data.sales || []); // Use a set to stop duplicates during import
        sales.add(row['Number']);

        const { errors: updateErrors } = await client.models.Item.update({
            ...item.data,
            sales: Array.from(sales),
            lastSoldAt: toISO(row['Finalized']),
        });

        logger.ifErrorThrow('Failed to update item', updateErrors);

        return toSaleItem(item.data);
    })).then(items => items.filter(item => item !== null) as SaleItem[]);

    logger.info('Sale Items retrieved', saleItems);

    const newSale = {
        id: uuidv4(),
        number: row['Number'],
        lastActivityBy: id,
        status: 'Finalized' as const,
        discount: discount(row),
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
        items: saleItems,
    }

    logger.info(`Creating sale : ${JSON.stringify(newSale)}`);

    const { data, errors } = await client.models.Sale.create(newSale);

    logger.ifErrorThrow('Failed to create sale ', errors);

    logger.info('Created sale', data);


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

function paymentType(row: Row): PaymentType {
    if (money(row["Cash Payments"]) > 0) { return "Cash"; }
    if (money(row["Credit Card Payments"]) > 0) { return "Card"; }
    if (money(row["Store Credit Payments"]) > 0) { return "StoreCredit"; }
    if (money(row["Gift Card Payments"]) > 0) { return "GiftCard"; }
    return 'Other'
}

function discount(row: Row): { label: string, value: number } | null {

    ['100000 (deleted 18 Feb 2020)',
        'Staff Discount',
        '25% Vitrine discount (deleted 17 Aug 2020)',
        '50%',
        'Summer Sale (deleted 17 Aug 2020)',
        '50%  Alte Kleider Sale (deleted 19 Jul 2022)',
        'Markenkleider (deleted 17 Aug 2020)',
        '10 % sale (deleted 21 Feb 2022)',
        'sale 25% (deleted 17 Mar 2022)',
        '50% (deleted 25 Feb 2022)',
        'Petit Etoile 20% (deleted 17 Mar 2022)',
        'Markenkleider SALE',
        'Alte Markenschue',
        'Wollbefinden (deleted 2 Feb 2023)'].forEach((key) => {
            const label = key as keyof Row;
            const value = money(row[label]);
            if (value > 0) {
                logger.info(`Discount found: ${label} - ${value}`)
                return { label, value }
            }
        });
    return null;
}

