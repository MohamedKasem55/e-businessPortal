import {BeneficiaryModel} from "../beneficiary/beneficiary.model";
import {Account} from "../../common/account";

export interface ValidateReqModel {
  listBeneficiaries: BeneficiaryModel[]
  operationDate: string
  segment: string,
  transferIntList: TransferInt[],
  remitterCategory: string
}


export interface TransferInt {
  accountFrom: string,
  additionalInfo1: string,
  additionalInfo1Lbl: string,
  additionalInfo2: string,
  additionalInfo2Lbl: string,
  additionalInfoFlag: string,
  amount: string,
  currency: string,
  email: string,
  payType: string,
  remarks: string,
  transferReason: string,
  transferReasonLbl: string,
}
