
import { BankModel } from "../../common/bank.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalTransferBankResModel extends BaseResponse {
  banks: BankModel[];
}
