/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  returnUrl: string;
  /**
   * One-time code, equivalent to the link.
   *
   * Optional so this template and the API can ship in either order: every environment reads this
   * repository's `main` at runtime, so a required field would stop login emails sending until the
   * API caught up. Tighten to required once the API is live everywhere.
   */
  otp?: string;
  /** How long the code lasts, worded by the API so it cannot drift from the real setting. */
  expiresIn?: string;
}

export const sampleData: IModel[] = [
  {
    returnUrl: "https://www.rocketmakers.com",
  },
  {
    returnUrl: "https://www.rocketmakers.com",
    otp: "417902",
    expiresIn: "10 minutes",
  },
];
