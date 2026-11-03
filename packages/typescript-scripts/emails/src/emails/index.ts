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
  // Two login layouts, because a login email carries a link or a code and never both: `login` is the
  // web app's, `loginCode` is the PWA's. The API picks between them from the `client` on the login
  // request, so neither template needs to know which asked.
  await generate("login", {
    title: "Welcome",
    greeting: "Hello,",
    copy: [
      "Please click the link below to complete your login. If you did not request this link, please ignore this email.",
    ],
    actionLink: {
      href: "{{returnUrl}}",
      text: "Complete login",
    },
  });

  // No `notes`: the code block carries the expiry wording, quoted by the API from Supabase's
  // real `otp_expiry` rather than the hardcoded 24 hours, which described the link only.
  await generate("loginCode", {
    title: "Welcome",
    greeting: "Hello,",
    copy: [
      "Enter the code below in the app to complete your login. If you did not request it, please ignore this email.",
    ],
    otp: {
      intro: "Your sign-in code:",
      code: "{{otp}}",
      note: "Expires in {{expiresIn}}. Never share it with anyone.",
    },
  });

  await generate("inviteUser", {
    title: "Welcome",
    greeting: "Hello,",
    copy: [
      "You have been invited to join the IRARA IRT system. Please click the link below to complete the setup of your account.",
    ],
    actionLink: {
      href: "{{returnUrl}}",
      text: "Verify account",
    },
    notes: ["You have 24 hours to click the link before it expires."],
  });

  await generate("unregisteredUser", {
    title: "Unknown account",
    greeting: "Hello,",
    copy: [
      "It looks like you tried to access our service without an account. Please contact support if you require an account.",
    ],
  });

  // Emailed to a case's lead returnee with the link to their anonymous survey page. The survey's name
  // doubles as the eyebrow, since the payload carries no separate phase label.
  await generate("surveyInvitation", {
    eyebrow: "{{surveyName}}",
    title: "Monitoring & Evaluation",
    greeting: "Hello {{forename}},",
    copy: [
      "We invite you to complete the {{surveyName}} questionnaire about your return and your situation now. Complete it yourself, in your own words.",
    ],
    actionLink: {
      href: "{{surveyUrl}}",
      text: "Complete the questionnaire",
    },
    notes: [
      "Your progress saves automatically as you complete the questionnaire. Submitting your answers is a separate action.",
      "This link is for you only. Please do not share it with anyone else.",
    ],
    aside: {
      title: "If you need support",
      copy: "This questionnaire is not a way to request individual help. The team cannot contact you from your answers. If you need medical or mental wellbeing support, please seek help directly from a suitable local service.",
    },
    closing: "Thank you for considering sharing your experience.",
  });
}
