import { BeneficiaryItem } from "./beneficiaries-res"

export interface ValidateReqModel {
  listPayments: AramcoPaymentItem[]
}

export interface AramcoPaymentItem {
  aramcoBeneficiary?: BeneficiaryItem,
  accountNumber: string,
  amount: string
}

