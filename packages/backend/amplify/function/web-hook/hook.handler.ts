import { Logger } from "@aws-lambda-powertools/logger";
import type { APIGatewayProxyHandler } from "aws-lambda";

const logger = new Logger({ serviceName: "cc-hook" });

export const handler: APIGatewayProxyHandler = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));
    const requestStoreId = event.headers?.["x-consigncloud-store-id"];
    const expectedStoreId = process.env.STORE_ID;

    if (requestStoreId !== expectedStoreId) {
        logger.error(`Unauthorized request from store ${requestStoreId}`);
        return {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify("Unauthorized"),
        };
    }



    return {
        statusCode: 200,
        // Modify the CORS settings below to match your specific requirements
        headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        },
        body: JSON.stringify("Update :" + JSON.stringify(event)),
    };
};