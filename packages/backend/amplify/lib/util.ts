import { LambdaClient, ListTagsCommand } from "@aws-sdk/client-lambda";

export const getLambdaTagByName = async (tagName: string): Promise<string | null> => {
    try {
        const tagValue = (await getLambdaTags())[tagName] ?? undefined;
        if (tagValue) {
            console.log(`Tag "${tagName}" has value:`, tagValue);
        } else {
            console.log(`Tag "${tagName}" not found.`);
        }
        return tagValue;
    } catch (error) {
        console.error('Error fetching Lambda tags:', error);
        return null;
    }
};

/**
 * Parses a date string and returns it in ISO format
 * @param datestring any date string that can be converted to a date
 * @returns the date string in ISO format
 */
export function toISO(datestring?: string | null): string | null {
    try {
        if (datestring) {
            if (datestring.length === 0) { return null; }
            return new Date(datestring).toISOString();
        }
        return null;
    } catch (error) {
        console.error(`Error parsing date: ${datestring}`, error);
        return null;
    }
}

// Function to construct Lambda ARN
export const functionArn = (): string => {
    // Get Lambda function name, region, and account ID from environment variables
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME;
    const region = process.env.AWS_REGION;
    const accountId = process.env.AWS_ACCOUNT_ID;

    if (!functionName || !region || !accountId) {
        throw new Error('Missing required environment variables');
    }

    return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`;
};

// Function to get Lambda tags
export const getLambdaTags = async (): Promise<Record<string, string>> => {
    try {
        // Construct the Lambda function ARN using the helper function

        const client = new LambdaClient({});
        const params = { Resource: process.env.AWS_LAMBDA_FUNCTION_NAME };

        const command = new ListTagsCommand(params);
        const data = await client.send(command);

        console.log('Lambda function tags:', data.Tags);
        return data.Tags!;
    } catch (error) {
        console.error('Error fetching Lambda tags:', error);
        return {};
    }
};
