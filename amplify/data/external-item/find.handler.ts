
import { Logger } from "@aws-lambda-powertools/logger";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/find-external-item-function";

import { findFirstItem } from "../../lib/services/item.external.sevice";
import { Schema } from "../resource";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);


const logger = new Logger({ serviceName: "find-external-item" });

export const handler: Schema["findExternalItem"]["functionHandler"] = async (event) => {
    logger.info("event", JSON.stringify(event, null, 2));
    const externalItem = await findFirstItem(event.arguments.query);
    logger.info("externalItem", JSON.stringify(externalItem, null, 2));

    return externalItem;
};

