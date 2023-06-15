import {Account} from "../../common/account";
import {RequestValidate} from "../../common/otp.model";
import {BatchResponse} from "../../common/batchResponse";


export interface ConfirmReqModel extends BatchResponse {
  accountDTOFrom: Account
  accountDTOTo: Account
  remarks: string
  currencyDeal: string
  amountDealt: number
  requestValidate: RequestValidate,
  inqRates: any
}

