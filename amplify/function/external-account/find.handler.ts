import type { Handler } from "aws-lambda";

import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/find-external-account-function";

import { findFirst } from "./account.external.sevice";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);


const logger = new Logger({ serviceName: "search" });

export const handler: Handler = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));
    const externalAccount = await findFirst(event.number);
    logger.info("externalAccount", JSON.stringify(externalAccount, null, 2));

    return JSON.stringify(externalAccount);
};

