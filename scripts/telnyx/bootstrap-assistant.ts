import { readFile } from "node:fs/promises";
import path from "node:path";
import Telnyx from "telnyx";

type AssistantConfig = Record<string, unknown> & {
  tools?: Array<Record<string, unknown>>;
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, "");

const injectToolUrls = (config: AssistantConfig, baseUrl: string): AssistantConfig => {
  const tools = config.tools?.map((tool) => {
    const webhook = tool.webhook as Record<string, unknown> | undefined;
    if (!webhook || typeof webhook.url !== "string") {
      return tool;
    }

    return {
      ...tool,
      webhook: {
        ...webhook,
        url: webhook.url.replace("{{APP_BASE_URL}}", baseUrl),
      },
    };
  });

  return {
    ...config,
    tools,
  };
};

const run = async () => {
  const apiKey = required("TELNYX_API_KEY");
  const baseUrl = normalizeBaseUrl(required("APP_BASE_URL"));
  const assistantId = process.env.TELNYX_ASSISTANT_ID;

  const configPath = path.resolve(process.cwd(), "src/config/telnyx/jarvis-assistant.json");
  const rawConfig = await readFile(configPath, "utf8");
  const parsed = JSON.parse(rawConfig) as AssistantConfig;
  const assistantConfig = injectToolUrls(parsed, baseUrl);

  const client = new Telnyx({ apiKey });

  if (assistantId) {
    const updated = await client.ai.assistants.update(
      assistantId,
      assistantConfig as never,
    );
    console.log(`Updated Telnyx assistant: ${updated.id}`);
    console.log(`TELNYX_ASSISTANT_ID=${updated.id}`);
    return;
  }

  const created = await client.ai.assistants.create(assistantConfig as never);
  console.log(`Created Telnyx assistant: ${created.id}`);
  console.log(`TELNYX_ASSISTANT_ID=${created.id}`);
};

run().catch((error) => {
  console.error("Failed to bootstrap Telnyx assistant");
  console.error(error);
  process.exit(1);
});
