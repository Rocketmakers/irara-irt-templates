import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

import {
  button,
  closing,
  column,
  content,
  eyebrow,
  fallbackIntro,
  h1,
  header,
  headerInner,
  hr,
  hyperlink,
  logo,
  main,
  note,
  otpCode,
  paragraph,
  signOff,
  supportHeading,
} from "./styles";

// Served from this (public) repo's main branch, so a new logo only reaches inboxes once it is merged.
const logoUrl =
  "https://raw.githubusercontent.com/Rocketmakers/irara-irt-templates/main/assets/logo.png";

export interface IBaseEmailProps {
  /**
   * Inbox preview text, shown after the subject. Defaults to the first line of `copy`, since the title
   * mostly repeats the subject the API sets.
   */
  preview?: string;
  /** Small uppercase line above the title. */
  eyebrow?: string;
  title: string;
  greeting?: string;
  copy: string[];
  actionLink?: { href: string; text: string };
  /** One-time code, filled per send. Don't combine with `actionLink`: an email carries one or the other. */
  otp?: { intro: string; code: string; note: string };
  /** Small print under the action, above the copy-this-link fallback. */
  notes?: string[];
  /** Set-apart section under a rule, e.g. where to get help. */
  aside?: { title: string; copy: string };
  closing?: string;
  signOff?: string;
}

export const BaseEmail = ({
  preview,
  eyebrow: eyebrowText,
  title,
  greeting,
  copy,
  actionLink,
  otp,
  notes = [],
  aside,
  closing: closingText = "Best regards,",
  signOff: signOffText = "IRARA",
}: IBaseEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>{preview ?? copy[0]?.replace(/<[^>]+>/g, "") ?? title}</Preview>
    <Body style={main}>
      <Section style={header}>
        <Container style={column}>
          <Section style={headerInner}>
            <Img
              style={logo}
              src={logoUrl}
              width="144"
              height="35"
              alt="IRARA"
            />
          </Section>
        </Container>
      </Section>
      <Container style={column}>
        <Section style={content}>
          {eyebrowText && <Text style={eyebrow}>{eyebrowText}</Text>}
          <Heading style={h1}>{title}</Heading>
          {greeting && <Text style={paragraph}>{greeting}</Text>}
          {copy.map((c, index) => (
            <Text
              key={index}
              style={paragraph}
              dangerouslySetInnerHTML={{ __html: c }}
            />
          ))}
          {actionLink && (
            <Button style={button} href={actionLink.href}>
              {actionLink.text}
            </Button>
          )}
          {otp && (
            <>
              <Text style={paragraph}>{otp.intro}</Text>
              <Text style={otpCode}>{otp.code}</Text>
              <Text style={note}>{otp.note}</Text>
            </>
          )}
          {notes.map((n, index) => (
            <Text key={index} style={note}>
              {n}
            </Text>
          ))}
          {actionLink && (
            <>
              <Text style={fallbackIntro}>
                If the button does not work, copy this link into your browser:
              </Text>
              <Link style={hyperlink} href={actionLink.href}>
                {actionLink.href}
              </Link>
            </>
          )}
          {aside && (
            <>
              <Hr style={hr} />
              <Text style={supportHeading}>{aside.title}</Text>
              <Text style={note}>{aside.copy}</Text>
            </>
          )}
          <Text style={closing}>{closingText}</Text>
          <Text style={signOff}>{signOffText}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BaseEmail;

BaseEmail.PreviewProps = {
  eyebrow: "Phase 1 · On arrival",
  title: "Monitoring & Evaluation",
  greeting: "Hello,",
  copy: [
    "We invite you to complete the Phase 1 questionnaire about your return and your situation now. Complete it yourself, in your own words.",
  ],
  actionLink: {
    href: "{{surveyUrl}}",
    text: "Complete the questionnaire",
  },
  notes: [
    "Your progress saves automatically as you complete the questionnaire. Submitting your answers is a separate action.",
  ],
  aside: {
    title: "If you need support",
    copy: "This questionnaire is not a way to request individual help. The team cannot contact you from your answers. If you need medical or mental wellbeing support, please seek help directly from a suitable local service.",
  },
  closing: "Thank you for considering sharing your experience.",
} as IBaseEmailProps;
