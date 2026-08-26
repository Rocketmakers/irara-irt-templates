/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  returnUrl: string;
  /**
   * One-time code, equivalent to the link, and the only way in on an installed iOS app.
   *
   * Optional so this template and the API can be released in either order: every environment reads
   * this repository's `main` at runtime, so a required field would stop login emails sending until
   * the API caught up. Tighten to required once the API is live everywhere.
   */
  otp?: string;
  /** The request came from the field app, so the iOS explanation applies. */
  isFieldApp?: boolean;
  /** How long the link and code last, worded by the API so it cannot drift from the real setting. */
  expiresIn?: string;
}

export const sampleData: IModel[] = [
  {
    returnUrl: "https://www.rocketmakers.com",
  },
  {
    returnUrl: "https://www.rocketmakers.com",
    otp: "417902",
    isFieldApp: false,
    expiresIn: "10 minutes",
  },
  {
    returnUrl: "https://www.rocketmakers.com",
    otp: "417902",
    isFieldApp: true,
    expiresIn: "10 minutes",
  },
];
