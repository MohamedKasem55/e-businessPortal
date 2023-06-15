import { BankCurrencyModel } from "../../common/bank-currency.model";
import { CountryModel } from "../../common/country.model";
import { BankBranchListModel } from "./bank-branch-list.model";
import {BaseResponse} from "../../common/base-response";

export interface BeneficiaryInternationalBankBranchesDetailsResModel extends BaseResponse {
  routingIndex: string;
  routingCode: string;
  bankBranchList: BankBranchListModel[];
  bankCurrencies: BankCurrencyModel;
  country: CountryModel;
}
