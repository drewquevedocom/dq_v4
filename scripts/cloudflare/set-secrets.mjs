#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const args = process.argv.slice(2);

let envFile = ".env.cloudflare.staging";
let workerEnv;

for (let i = 0; i < args.length; i += 1) {
  const token = args[i];
  if ((token === "--file" || token === "-f") && args[i + 1]) {
    envFile = args[i + 1];
    i += 1;
    continue;
  }

  if (token === "--env" && args[i + 1]) {
    workerEnv = args[i + 1];
    i += 1;
  }
}

const absolutePath = resolve(process.cwd(), envFile);

const parseEnv = (content) => {
  const entries = [];
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const delimiter = line.indexOf("=");
    if (delimiter === -1) {
      continue;
    }

    const key = line.slice(0, delimiter).trim();
    let value = line.slice(delimiter + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries.push({ key, value });
  }
  return entries;
};

const run = (command, commandArgs, stdinValue) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, commandArgs, {
      stdio: ["pipe", "inherit", "inherit"],
      shell: process.platform === "win32",
    });

    child.stdin.write(stdinValue);
    child.stdin.end();

    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`Command failed with exit code ${code}`));
      }
    });
  });

try {
  const content = readFileSync(absolutePath, "utf8");
  const entries = parseEnv(content).filter((entry) => entry.value.length > 0);

  if (!entries.length) {
    throw new Error(`No non-empty env vars found in ${absolutePath}`);
  }

  for (const entry of entries) {
    const wranglerArgs = ["wrangler", "secret", "put", entry.key];
    if (workerEnv) {
      wranglerArgs.push("--env", workerEnv);
    }

    // eslint-disable-next-line no-console
    console.log(`Setting secret: ${entry.key}`);
    await run("npx", wranglerArgs, `${entry.value}\n`);
  }

  // eslint-disable-next-line no-console
  console.log(`Done. ${entries.length} secrets set from ${absolutePath}`);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : "Failed to set secrets");
  process.exit(1);
}
