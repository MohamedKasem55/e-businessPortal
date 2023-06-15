import {Account} from "../../common/account";


export interface ValidateReqModel {
  amount: number
  accountDTOTo: Account
  accountDTOFrom: Account
  remarks: string
  dealCurrency: string
  segment: string
}
