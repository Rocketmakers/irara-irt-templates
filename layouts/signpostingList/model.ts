/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  returneeName: string;
  countryName: string;
}

export const sampleData: IModel[] = [
  {
    returneeName: "Amara Okafor",
    countryName: "Germany",
  },
];
