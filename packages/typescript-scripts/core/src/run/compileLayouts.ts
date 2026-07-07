import { LoggerLevel } from "@rocketmakers/log";
import { match, single } from "@rocketmakers/shell/args";
import {
  createLogger,
  setDefaultLoggerLevel,
} from "@rocketmakers/shell/logger";
import { Ajv } from "ajv";
import { readFile, writeFile } from "fs/promises";
import { exists, mkdir } from "fs-extra";
import * as handlebars from "handlebars";
import * as path from "path";

import { handlebarsHelpers } from "../handlebarsHelpers";
import { resolve } from "../repositoryPaths";

const logger = createLogger("compile-layouts");

interface IPartial {
  path: string;
}

interface ILayout {
  path: string;
  templates: string[];
}

interface IServiceJson {
  partials: Record<string, IPartial>;
  layouts: Record<string, ILayout>;
}

interface IPayloadSchema {
  examples: unknown[];
}

async function run() {
  const args = await match({
    log: single({
      description: "The log level",
      shortName: "l",
      defaultValue: "info",
      validValues: ["trace", "debug", "info", "warn", "error", "fatal"],
    }),
    serviceName: single({
      description: "Name of 3rd party service root json file is named after",
      shortName: "s",
      mandatory: true,
    }),
  });

  if (!args) {
    if (process.argv.includes("--help")) {
      return;
    }

    throw new Error("There was a problem parsing the arguments");
  }

  const { log, serviceName } = args;

  setDefaultLoggerLevel(log as LoggerLevel);

  const fileName = `${serviceName}.json`;
  const serviceJson = JSON.parse(
    await readFile(resolve(fileName), "utf8"),
  ) as IServiceJson;

  const serviceJsonSchema = JSON.parse(
    await readFile(
      "node_modules/@rocketmakers/orbit-template-http-repository/serviceJsonSchema.json",
      "utf8",
    ),
  );

  const ajv = new Ajv({ allErrors: true, verbose: true });
  const validServiceJson = ajv.validate(serviceJsonSchema, serviceJson);

  if (!validServiceJson) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't have any proper typings
      `The file ${fileName} failed to meet the predefined schema with the following errors: ${ajv.errors ? ajv.errors.map((x: any) => x.message).toString() : ""}`,
    );
  }

  const { partials, layouts } = serviceJson;

  logger.info("Registering partials --> ");

  if (partials) {
    const partialKeys = Object.keys(partials);
    for (const partial of partialKeys) {
      const content = await readFile(resolve(partials[partial].path), "utf8");
      handlebars.registerPartial(partial, content);
      logger.info("Registered partial: ", partial);
    }
  }

  logger.info("Registering helpers --> ");

  for (const helper of handlebarsHelpers) {
    handlebars.registerHelper(helper.name, helper.helper);
    logger.info("Registered helper: ", helper.name);
  }

  logger.info("Compiling layouts --> ");

  const layoutKeys = Object.keys(layouts);
  for (const layout of layoutKeys) {
    logger.info("Compiling layout", layout);
    for (const template of layouts[layout].templates) {
      const content = await readFile(
        resolve(`${layouts[layout].path}/${template}.handlebars`),
        "utf8",
      );

      const data = (
        JSON.parse(
          await readFile(
            resolve(`${layouts[layout].path}/payloadSchema.json`),
            "utf8",
          ),
        ) as IPayloadSchema
      ).examples[0];

      const compile = handlebars.compile(content, { strict: true });

      const res = compile(data);
      const dir = resolve("compiledLayouts");
      if (!(await exists(dir))) {
        await mkdir(dir);
      }
      await writeFile(path.join(dir, `${layout}.${template}`), res);
      logger.trace("Compiled template: ", res);
    }
    logger.info("Compiled layout");
  }

  logger.info("Templates successfully validated for service: ", serviceName);
}

run().catch((err) => {
  logger.fatal(err);
  process.exit(-1);
});
