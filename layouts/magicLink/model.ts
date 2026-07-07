/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  forename: string;
  returnUrl: string;
}

export const sampleData: IModel[] = [
  {
    forename: "David",
    returnUrl: "https://www.rocketmakers.com",
  },
];
