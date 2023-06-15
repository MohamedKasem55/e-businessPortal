import {BeneficiaryModel} from "./beneficiary.model";

export interface FillBeneficiariesReqModel {
  listBeneficiariesSelected: BeneficiaryModel[],
  remitterCategory: string
}
