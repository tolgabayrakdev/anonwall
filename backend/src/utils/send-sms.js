import Netgsm from "@netgsm/sms";
import logger from "../config/logger.js";

let netgsm = null;

// Initialize NetGSM only if credentials are provided
if (process.env.NETGSM_NUMBER && process.env.NETGSM_PASSWORD) {
    netgsm = new Netgsm({
        username: process.env.NETGSM_NUMBER,
        password: process.env.NETGSM_PASSWORD,
        appname: ""
    });
}

export async function sendSms({ msg, no }) {
    // If NetGSM is not configured, log and return mock jobid for development
    if (!netgsm) {
        logger.warn("⚠️  NetGSM not configured. SMS not sent (development mode)");
        logger.info(`Would send SMS to ${no}: ${msg}`);
        return 'mock_jobid_' + Date.now();
    }

    try {
        const response = await netgsm.sendRestSms({
            msgheader: process.env.NETGSM_NUMBER,
            encoding: "TR",
            messages: [{
                msg: msg,
                no: no
            }]
        });
        logger.info("SMS sent:", response);
        return response.jobid;
    } catch (error) {
        logger.error("❌ Failed to send SMS:", error);
        throw error;
    }
}