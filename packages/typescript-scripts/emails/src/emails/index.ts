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
  await generate("login", {
    title: "Welcome",
    copy: [
      "Please click the link below to complete your login. If you did not request this link, please ignore this email.",
    ],
    actionLink: {
      href: "{{returnUrl}}",
      text: "Complete login",
    },
    footerText: "You have 24 hours to click the link before it expires",
  });

  await generate("inviteUser", {
    title: "Welcome",
    copy: [
      "You have been invited to join the IRARA IRT system. Please click the link below to complete the setup of your account.",
    ],
    actionLink: {
      href: "{{returnUrl}}",
      text: "Verify account",
    },
    footerText: "You have 24 hours to click the link before it expires",
  });

  await generate("unregisteredUser", {
    title: "Unknown account",
    copy: [
      "It looks like you tried to access our service without an account. Please contact support if you require an account.",
    ],
  });
}
