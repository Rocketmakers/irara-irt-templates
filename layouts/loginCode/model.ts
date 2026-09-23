/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  /** One-time code, the only way into the PWA: a magic link there opens Safari, not the app. */
  otp: string;
  /** How long the code lasts, worded by the API so it cannot drift from the real setting. */
  expiresIn: string;
}

export const sampleData: IModel[] = [
  {
    otp: "417902",
    expiresIn: "10 minutes",
  },
];
