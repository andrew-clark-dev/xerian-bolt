import { Backend } from "@aws-amplify/backend";
import { CorsHttpMethod, HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { IFunction } from "aws-cdk-lib/aws-lambda";

export function createHttpWebhookApi(backend: Backend<any>, lambda: IFunction) {
    const apiStack = backend.createStack("http-api-stack");

    // Create an HTTP API
    const httpApi = new HttpApi(apiStack, "WebhookHttpApi", {
        apiName: "WebhookApi",
        corsPreflight: {
            // Restrict this to domains you trust
            allowOrigins: ["https://consigncloud.com"],  // Restrict to specific origin
            // Specify only the headers you need to allow
            allowHeaders: ["Content-Type", "X-API-KEY"],
            // Modify the CORS settings below to match your specific requirements
            allowMethods: [CorsHttpMethod.POST]
        },
    });

    // Integrate with Lambda
    const lambdaIntegration = new HttpLambdaIntegration("LambdaIntegration", lambda);

    // Add a webhook event route
    httpApi.addRoutes({
        path: "/event",
        methods: [HttpMethod.POST],
        integration: lambdaIntegration,
    });

    backend.addOutput({
        custom: {
            WebhookAPI: {
                endpoint: httpApi.apiEndpoint,
            },
        },
    });
}