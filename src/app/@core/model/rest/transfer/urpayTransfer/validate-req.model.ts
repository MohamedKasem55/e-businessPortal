import {Account} from "../../common/account";
import {AmountModel} from "../../common/amount.model";

export interface ValidateReqModel {
  remitterName: string,
  accountForm: Account
  topupAmount: AmountModel,
  walletMobileNum: string,
  remitterIBAN: string,
  walletVIBAN: string,
  remarks: string

}

