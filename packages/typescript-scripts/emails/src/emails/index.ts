import { writeFile } from "fs/promises";
import { join } from "path";
import { pretty, render, toPlainText } from "react-email";

import { BaseEmail, IBaseEmailProps } from "./base";

async function generate(name: string, props: IBaseEmailProps) {
  const html = await pretty(await render(BaseEmail(props), {}));
  const outputPath = join(
    __dirname,
    `../../../../../layouts`,
    `${name}/html.handlebars`,
  );
  await writeFile(outputPath, html, "utf8");

  const txt = toPlainText(html, {
    selectors: [{ selector: "h1", options: { uppercase: false } }],
  });
  const outputPathTxt = join(
    __dirname,
    `../../../../../layouts`,
    `${name}/txt.handlebars`,
  );
  await writeFile(outputPathTxt, txt, "utf8");
}

export async function generateEmails() {
  await generate("magicLink", {
    title: "Welcome",
    copy: [
      "To complete the setup of your account we first need you to verify your email address.",
    ],
    actionLink: {
      href: "{{returnUrl}}",
      text: "Verify account",
    },
    footerText: "You have 24 hours to click the link before it expires",
  });
}
