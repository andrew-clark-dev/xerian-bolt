import { resetData } from "../../lib/services/table.sevice";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/reset-data-function";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: "reset-data-handler" });

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

export const handler = async (event: unknown) => {
    logger.info(`Reset all data table event: ${JSON.stringify(event)}`);

    const models = JSON.parse(env.MODELS);
    logger.info(`Resetting data for models: ${env.MODELS}`);
    await resetData(models);
    return `Data reset successfully`;

};
