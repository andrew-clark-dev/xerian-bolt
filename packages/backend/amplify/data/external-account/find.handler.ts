
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/find-external-account-function";

import { findFirst } from "../../lib/services/account.external.sevice";
import { Schema } from "../resource";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);


const logger = new Logger({ serviceName: "find-external-account" });

export const handler: Schema["findExternalAccount"]["functionHandler"] = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));
    const externalAccount = await findFirst(event.arguments.query);
    logger.info("externalAccount", JSON.stringify(externalAccount, null, 2));

    return externalAccount;
};

