import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log("event", event);
    // Extract API Key from request headers
    const requestApiKey = event.headers?.["x-api-key"];
    const expectedApiKey = process.env.API_KEY;
    const requestStoreId = event.headers?.["x-consigncloud-store-id"];
    const expectedStoreId = process.env.STORE_ID;
    console.log("requestApiKey", requestApiKey);
    console.log("expectedApiKey", expectedApiKey);
    console.log("requestStoreId", requestStoreId);
    console.log("expectedStoreId", expectedStoreId);
    return {
        statusCode: 200,
        // Modify the CORS settings below to match your specific requirements
        headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        },
        body: JSON.stringify("Hello from myFunction! \n Event:" + JSON.stringify(event)),
    };
};