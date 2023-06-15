import {Account} from "../../common/account";
import {BeneficiaryModel} from "../beneficiary/beneficiary.model";

export interface ValidateReqModel {
  listBeneficiaries?: BeneficiaryModel[],
  listTransfersLocal: LocalTransferModel[],
  segment: string,
  operationDate: string,
  quickProxy?: QuickProxyModel
}

export interface LocalTransferModel {
  accountForm: Account,
  amount: string,
  currency: number
  purposeCodeTransfer: string
  remarks: string,
  email?: string
}

export interface QuickProxyModel {
  participantBankId: string,
  beneficiaryName?: string,
  beneficiaryIBAN?: string,
  proxyType: {
    type: string,
    value: string
  } | null
}
