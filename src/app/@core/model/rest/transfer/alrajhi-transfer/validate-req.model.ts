import {BeneficiaryModel} from "../beneficiary/beneficiary.model";
import {Account} from "../../common/account";

export interface ValidateReqModel{
    listBeneficiaries: BeneficiaryModel[]
    operationDate: string
    listTransfersWithn: ListTransfersWithn[]
  }


  export interface ListTransfersWithn {
    accountForm: Account
    accountNumberTo: string
    amount: string
    remarks: string
  }
