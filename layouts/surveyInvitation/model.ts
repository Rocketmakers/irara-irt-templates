/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  forename: string;
  surveyName: string;
  surveyUrl: string;
}

export const sampleData: IModel[] = [
  {
    forename: "Amara",
    surveyName: "Three month check-in",
    surveyUrl:
      "https://www.rocketmakers.com/survey/00000000-0000-0000-0000-000000000000?token=sample-token",
  },
];
