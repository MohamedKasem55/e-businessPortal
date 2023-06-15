import { BankCurrencyModel } from "../../common/bank-currency.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalCurrencyResModel extends BaseResponse {
  currencies: BankCurrencyModel;
}
