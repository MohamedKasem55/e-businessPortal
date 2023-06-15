import {SummaryModel} from "arb-design-library/model/summary.model";

export interface ResultModal {

  type: "Success" | "Error" | "Warning" | "Pending";
  title: string;
  subTitle?: string | undefined;
  summary: SummaryModel | undefined;
  showSariaLogo?: boolean;
}
