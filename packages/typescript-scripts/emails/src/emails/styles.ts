import { CSSProperties } from "react";

const primaryColour = "#078c28";
const textColor = "#ADABAA";
const backgroundColour = "#1C1B1B";
const headerColor = "#313030";

export const main: CSSProperties = {
  margin: "0px",
  backgroundColor: backgroundColour,
  color: textColor,
  textAlign: "center",
  fontSize: "16px",
  fontFamily: "Inter,sans-serif",
};

export const h1: CSSProperties = {
  fontSize: "35px",
  fontWeight: "600",
  textAlign: "center",
  color: primaryColour,
};

export const logoContainer: CSSProperties = {
  backgroundColor: headerColor,
  margin: "0 auto",
  padding: "20px 0 20px",
};

export const logo: CSSProperties = {
  margin: "0 auto",
};

export const container: CSSProperties = {
  backgroundColor: backgroundColour,
  margin: "0px",
  padding: "10px 0 10px",
};

export const box: CSSProperties = {
  padding: "0 20px",
};

export const hr: CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

export const paragraph: CSSProperties = {
  fontSize: "16px",
  lineHeight: "24px",
};

export const button: CSSProperties = {
  boxSizing: "border-box",
  backgroundColor: primaryColour,
  borderRadius: "25px",
  color: "#FFFFFF",
  textDecoration: "none",
  display: "block",
  maxWidth: "300px",
  padding: "10px",
  margin: "20px auto",
};

export const signOffContainer: CSSProperties = {
  paddingBottom: "40px",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center",
};

export const signOff: CSSProperties = {
  margin: "0px",
  lineHeight: "20px",
};

export const footer: CSSProperties = {
  padding: "20px 0 20px",
  height: "100%",
  fontSize: "12px",
};

export const socialMedia: CSSProperties = {
  margin: "0 auto",
  marginBottom: "10px",
  width: "100px",
};

export const socialMediaItem: CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "50%",
  padding: "5px",
  marginRight: "5px",
};

export const hyperlink: CSSProperties = {
  color: "#707071",
  textDecoration: "underline",
};
