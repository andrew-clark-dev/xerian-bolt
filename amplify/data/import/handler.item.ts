import type { S3Handler } from "aws-lambda";
import { type Schema } from "../resource";
import { generateClient } from "aws-amplify/data";
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/import-item-function";
import AWS from "aws-sdk";
import Papa from "papaparse";
import { provisionService } from "../../lib/services/user.external.sevice";
import { ItemStatus } from "../../lib/services/item.external.sevice";
import { importUserId } from "../../lib/services/table.sevice";
import { archFile } from "./handler.receive";
export type Item = Schema['Item']['type']

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const logger = new Logger({ serviceName: "import-account-function" });

const client = generateClient<Schema>();

// Initialize AWS clients
const s3 = new AWS.S3();

interface Header {
    'SKU': string,
    'Created': string,
    'Created By': string,
    'Deleted': string,
    'Brand': string,
    'Color': string,
    'Size': string,
    'Details': string,
    'Description': string,
    'Title': string,
    'Account': string,
    'Account Name': string,
    'Account Company': string,
    'Category': string,
    'Shelf': string,
    'Cost Per': string,
    'Split Price': string,
    'Tag Price': string,
    'Tags': string,
    'Tax Exempt': string,
    'Split': string,
    'Inventory Type': string,
    'Terms': string,
    'Active': string,
    'Expired': string,
    'Lost': string,
    'Damaged': string,
    'Donated': string,
    'Stolen': string,
    'To Be Returned': string,
    'Returned To Owner': string,
    'Sold': string,
    'Parked': string,
    'Number Of Images': string,
    'Status': string,
    'Quantity': string,
    'Expires': string,
    'Schedule Start': string,
    'Days On Shelf': string,
    'Printed': string,
    'Batch': string,
    'Surcharges': string,
    'Last Sold': string,
    'Last Viewed': string,
    'Sales': string,
    'Refunds': string,
    'Historic Sale Price': string,
    'Historic Split Price': string,
    'Historic Consignor Portion': string,
    'Historic Store Portio': string,
}


/**
 * Lambda Handler Function
 */
export const handler: S3Handler = async (event): Promise<void> => {
    logger.info(`S3 event: ${JSON.stringify(event)}`);
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
        const { data } = Papa.parse<Header>(csvContent, { header: true });

        // Insert data into DynamoDB
        for (const row of data) {
            const nickname = row['Created By']
            const profile = await provisionService.provisionUserByName(nickname);
            logger.info(`Process: ${JSON.stringify(row)}`);
            await createItem(row, profile.id);
        }

        logger.info(`Successfully inserted ${data.length} accounts into DynamoDB`);

        // Move the file to the archive folder 
        await archFile(bucket, key);

    } catch (error) {
        logger.error((`Error processing CSV: ${JSON.stringify(error)}`));
        throw error;
    }
};


export function dateOf(datestring?: string | null): string | null {
    if (datestring) {
        return new Date(datestring).toISOString();
    }
    return null;

}
async function createGroup(row: Header) {
    const quantity = parseInt(row['Quantity'] || '1');
    if (quantity > 1) {
        logger.info(`Creating item group: ${row['SKU']}`);
        const { data: groupData, errors: groupErrors } = await client.models.ItemGroup.create({
            quantity,
            itemSku: row['SKU'],
            statuses: toStatuses(row['Status']),

        });
        if (groupErrors) {
            throw new Error(`Failed to create item group: ${JSON.stringify(groupErrors)}`);
        }
        logger.info(`Created item group: ${JSON.stringify(groupData!)}`);
    }
}

async function createItem(row: Header, id: string) {
    const item = await client.models.Item.get({ sku: row['SKU'] });
    if (item.data) {
        logger.info(`Item already exists: ${JSON.stringify(item.data)}`);
        return;
    }

    await createGroup(row);

    const newItem = {
        sku: row['SKU'],
        lastActivityBy: id,
        title: row['Title'],
        accountNumber: row['Account'],
        category: indexString(row['Category']),
        brand: indexString(row['Brand']),
        color: indexString(row['Color']),
        size: indexString(row['Size']),
        description: row['Description'],
        details: row['Details'],
        condition: 'NotSpecified' as const,
        split: parseInt(row['Split'].replace('%', '')),
        price: parseInt(row['Tag Price']),
        status: toStatus(row['Status']),
        printedAt: dateOf(row['Printed']),
        lastSoldAt: dateOf(row['Last Sold']),
        lastViewedAt: dateOf(row['Last Viewed']),
        createdAt: dateOf(row['Created']),
        updatedAt: dateOf(new Date().toISOString()),
        deletedAt: dateOf(row['Deleted']),
    }

    logger.info(`Creating item : ${JSON.stringify(newItem)}`);

    const { data, errors } = await client.models.Item.create(newItem);

    if (errors) {
        throw new Error(`Failed to create item: ${JSON.stringify(errors)}`);
    }
    logger.info(`Created item: ${JSON.stringify(data!)}`);

    logger.info(`Creating item import action: ${data?.sku}`);
    const { errors: actionErrors } = await client.models.Action.create({
        description: `Import of item`,
        modelName: "Item",
        type: "Import",
        typeIndex: "Import",
        refId: data?.id,
        userId: importUserId,
    });
    if (actionErrors) {
        throw new Error(`Failed to create account action:  ${JSON.stringify(errors)}`);
    }
    await createCategory('category', row['Category']);
    await createCategory('brand', row['Brand']);
    await createCategory('color', row['Color']);
    await createCategory('size', row['Size']);

}


const categories: string[] = [];

async function createCategory(kind: string, value?: string | null) {

    if (value) {
        if (categories.includes(kind + value)) {
            logger.info(`Category found in cach : ${kind} - ${value}`);
            return;
        }
        const category = await client.models.ItemCategory.get({ kind, name: value });
        if (category.data) {
            logger.info(`Category already exists: ${JSON.stringify(category.data)}`);
        } else {
            logger.info(`Creating ${kind}: ${value}`);
            const category = await client.models.ItemCategory.create({
                lastActivityBy: importUserId,
                kind: kind,
                name: value,
                matchNames: value,

            });
            if (category.errors) {
                logger.warn(`Failed to create category: ${kind}: ${value}`); // this is probably a race condition.
                return;
            }
            logger.info(`Created category: ${JSON.stringify(category.data)}`);
        }
        categories.push(kind + value);
    }
}

function indexString(value?: string): string | null {
    if (!value) {
        return null;
    } else if (value.trim() == '') {
        return null;
    }
    return value;
}

export function toStatuses(status: string): ItemStatus[] {
    const statuses: ItemStatus[] = [];

    status.split(',').forEach((s) => {
        const st = s.split(' ');
        const count = parseInt(st[0]);
        for (let i = 0; i < count; i++) {
            statuses.push(st[1].trim() as ItemStatus);
        }

    });
    return statuses;
}

export function toStatus(status: string): ItemStatus {
    const statuses = toStatuses(status);
    if (statuses.length == 0) {
        return 'Unknown';
    } else if (statuses.length == 1) {
        return statuses[0];
    } else {
        return 'Multi';
    }
}
