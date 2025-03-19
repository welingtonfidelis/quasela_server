import { SendEmailCommand } from "@aws-sdk/client-ses";

import { config } from "../../config";
import { sesClient } from "../../config/aws/sesClientConfig";

const { SOURCE_EMAIL } = config;

interface SendOneMailProps {
  to: string[];
  from?: string;
  subject: string;
  message: string;
}

const sendMail = (data: SendOneMailProps) => {
  const { to, subject, message, from = SOURCE_EMAIL } = data;
  const params = {
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from,
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
};

export { sendMail };
