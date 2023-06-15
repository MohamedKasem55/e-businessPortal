import {BeneficiaryModel} from "./beneficiary.model";
import {CurrencyModel} from "../../common/currency.model";

export interface FillBeneficiariesResModel {
  listBeneficiaries: BeneficiaryModel[],
  remitterCategory: ""
  currencyCodes: CurrencyModel
}
