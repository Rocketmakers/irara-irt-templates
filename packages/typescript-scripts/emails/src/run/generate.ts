import { LoggerLevel } from "@rocketmakers/log";
import { match, single } from "@rocketmakers/shell/args";
import {
  createLogger,
  setDefaultLoggerLevel,
} from "@rocketmakers/shell/logger";
import { check } from "@rocketmakers/shell/prerequisites";
import { ShellExecutor } from "@rocketmakers/shell-executor";

import { generateEmails } from "../emails";

const logger = createLogger("generate-api-env-file");
const shell = new ShellExecutor();

async function run() {
  const args = await match({
    log: single({
      description: "The log level",
      shortName: "l",
      defaultValue: process.env.LOG_LEVEL || "info",
      validValues: ["trace", "debug", "info", "warn", "error", "fatal"],
    }),
  });

  if (!args) {
    if (process.argv.includes("--help")) {
      return;
    }

    throw new Error("There was a problem parsing the arguments");
  }

  const { log } = args;

  if (log) {
    setDefaultLoggerLevel(log as LoggerLevel);
  }

  await check(shell);

  await generateEmails();
}

run()
  .then(() => logger.info("🚀 Done 🚀"))
  .catch((err) => {
    logger.fatal(err);
    process.exit(-1);
  });
