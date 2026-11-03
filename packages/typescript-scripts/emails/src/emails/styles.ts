import { CSSProperties } from "react";

const primaryColour = "#275dbf";
const headingColour = "#181f25";
const textColour = "#384757";
const mutedColour = "#5b6878";
const borderColour = "#eaedf2";
const pageColour = "#f5f7f9";
const fontFamily =
  "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const main: CSSProperties = {
  margin: "0px",
  backgroundColor: "#FFFFFF",
  color: textColour,
  fontSize: "16px",
  fontFamily,
};

// The bands run the full width of the page; what sits in them is capped at 600px and centred, so a wide
// client shows a column of text rather than stretching it.
export const header: CSSProperties = {
  borderTop: `6px solid ${primaryColour}`,
  borderBottom: `1px solid ${borderColour}`,
};

export const column: CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
};

export const headerInner: CSSProperties = {
  padding: "28px 40px",
};

export const logo: CSSProperties = {
  display: "block",
};

export const content: CSSProperties = {
  padding: "40px 40px 32px",
  textAlign: "left",
};

export const eyebrow: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: primaryColour,
};

export const h1: CSSProperties = {
  margin: "0 0 24px",
  fontSize: "30px",
  lineHeight: "38px",
  fontWeight: "600",
  color: headingColour,
};

export const paragraph: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "26px",
  color: textColour,
};

export const button: CSSProperties = {
  display: "inline-block",
  margin: "8px 0 24px",
  padding: "16px 36px",
  backgroundColor: primaryColour,
  borderRadius: "999px",
  color: "#FFFFFF",
  fontSize: "16px",
  lineHeight: "20px",
  fontWeight: "600",
  textDecoration: "none",
};

export const note: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "14px",
  lineHeight: "22px",
  color: mutedColour,
};

export const fallbackIntro: CSSProperties = {
  ...note,
  margin: "0 0 4px",
};

export const hyperlink: CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: primaryColour,
  textDecoration: "none",
  wordBreak: "break-all",
};

export const hr: CSSProperties = {
  margin: "28px 0",
  border: "none",
  borderTop: `1px solid ${borderColour}`,
};

export const supportHeading: CSSProperties = {
  margin: "0 0 8px",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "600",
  color: headingColour,
};

export const closing: CSSProperties = {
  ...paragraph,
  margin: "24px 0 16px",
};

export const signOff: CSSProperties = {
  margin: "0px",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "600",
  color: headingColour,
};

export const otpCode: CSSProperties = {
  display: "inline-block",
  margin: "8px 0 24px",
  padding: "12px 24px",
  backgroundColor: pageColour,
  border: `1px solid ${borderColour}`,
  borderRadius: "8px",
  fontSize: "32px",
  lineHeight: "40px",
  fontWeight: "600",
  letterSpacing: "6px",
  color: headingColour,
};
