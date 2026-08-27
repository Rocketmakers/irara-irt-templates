import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

import {
  box,
  button,
  container,
  h1,
  hyperlink,
  logo,
  logoContainer,
  main,
  otpCode,
  otpIntro,
  otpNote,
  paragraph,
  signOff,
  signOffContainer,
} from "./styles";

export interface IBaseEmailProps {
  title: string;
  copy: string[];
  footerText?: string;
  actionLink?: { href: string; text: string };
  /**
   * A one-time code shown as an alternative to the action link.
   *
   * `code` and `note` are handlebars, not copy, so the API fills them per send. The whole block is
   * emitted inside `{{#if otp}}`, so a payload without an `otp` renders nothing here - that is what
   * lets this template and the API ship in either order, since every environment reads this
   * repository's `main` at runtime.
   */
  otp?: { intro: string; code: string; note: string };
}

export const BaseEmail = ({
  title,
  actionLink,
  copy,
  footerText,
  otp,
}: IBaseEmailProps) => (
  <Html style={main}>
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <div style={logoContainer}>
        <Container>
          <Img
            style={logo}
            src={
              "https://www.rocketmakers.com/_next/static/media/logo.aa18c158.svg"
            }
            height="16"
            alt="Rocketmakers"
            className="mx-auto my-0"
          />
        </Container>
      </div>
      <div style={container}>
        <Container>
          <Section style={box}>
            <Heading style={h1}>{title}</Heading>
            {copy.map((c, index) => (
              <Text
                key={index}
                style={paragraph}
                dangerouslySetInnerHTML={{ __html: c }}
              />
            ))}
            {actionLink && (
              <>
                <Button style={button} href={actionLink?.href}>
                  {actionLink?.text}
                </Button>
                <Text style={paragraph}>
                  Or copy this URL into your browser's address bar:
                </Text>
                <Link style={hyperlink} href={actionLink?.href}>
                  {actionLink?.href}
                </Link>
              </>
            )}
            {otp && (
              <>
                {"{{#if otp}}"}
                <Text style={otpIntro}>{otp.intro}</Text>
                <Text style={otpCode}>{otp.code}</Text>
                <Text
                  style={otpNote}
                  dangerouslySetInnerHTML={{ __html: otp.note }}
                />
                {"{{/if}}"}
              </>
            )}
            {footerText && <Text style={paragraph}>{footerText}</Text>}
            <Container style={signOffContainer}>
              <Text style={signOff}>Best regards,</Text>
              <Text style={signOff}>Rocketmakers</Text>
            </Container>
          </Section>
        </Container>
      </div>
    </Body>
  </Html>
);

export default BaseEmail;

BaseEmail.PreviewProps = {
  title: "Welcome",
  copy: [
    "To complete the setup of your account we first need you to verify your email address.",
  ],
  actionLink: {
    href: "{{returnUrl}}",
    text: "Verify account",
  },
  footerText: "You have 24 hours to click the link before it expires",
} as IBaseEmailProps;
