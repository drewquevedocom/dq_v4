import Telnyx from "telnyx";
import { envBoolean, optionalEnv, requireEnv } from "@/lib/env";

let telnyxClient: Telnyx | undefined;

export const getTelnyxClient = (): Telnyx => {
  if (telnyxClient) {
    return telnyxClient;
  }

  telnyxClient = new Telnyx({
    apiKey: requireEnv("TELNYX_API_KEY"),
    publicKey: optionalEnv("TELNYX_PUBLIC_KEY"),
  });

  return telnyxClient;
};

export const shouldSkipTelnyxWebhookVerification = (): boolean =>
  envBoolean("TELNYX_WEBHOOK_SKIP_VERIFY", false);

export const normalizeTelnyxHeaders = (headers: Headers): Record<string, string> => {
  const normalized: Record<string, string> = {};

  headers.forEach((value, key) => {
    normalized[key.toLowerCase()] = value;
  });

  return normalized;
};

export const sendTelnyxSms = async ({
  to,
  text,
}: {
  to: string;
  text: string;
}): Promise<string | undefined> => {
  const client = getTelnyxClient();
  const from = requireEnv("TELNYX_SMS_FROM_NUMBER");

  const response = await client.messages.send({
    to,
    from,
    text,
  });

  return response.data?.id;
};
