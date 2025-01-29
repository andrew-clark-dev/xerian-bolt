
import { truncateTable } from "../../lib/services/table.sevice";
import { Logger } from "@aws-lambda-powertools/logger";
const logger = new Logger({ serviceName: "truncate-table-handler" });


export const handler = async (event: { model: string, index: string }) => {
    logger.info(`Reset all data table event: ${JSON.stringify(event)}`);

    logger.info(`Resetting data for models: ${event}`);
    truncateTable(event.model, event.index);
    return `Data reset successfully`;

};
