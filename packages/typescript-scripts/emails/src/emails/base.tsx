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
  paragraph,
  signOff,
  signOffContainer,
} from "./styles";

export interface IBaseEmailProps {
  title: string;
  copy: string[];
  footerText?: string;
  actionLink?: { href: string; text: string };
}

export const BaseEmail = ({
  title,
  actionLink,
  copy,
  footerText,
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
