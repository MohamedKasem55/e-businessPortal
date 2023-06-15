import { ErrorResponse } from "../../common/base-response"

export interface currentContractItem {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: string
  cicNum: string
  dossierNumber: string
  accountNumber: string
  installmentEndDate: string
  requestingBranch: any
  product: Product
  statusDesc: any
  contractDate: any
  financeAmt: any
  remainingAmt: number
  dueAmt: any
  frequency: any
  creditLine: CreditLine
  masterContractDtls: MasterContractDtls
}


export interface Product {
  productCode: string
}

export interface CreditLine {
  totalAmt: number
}

export interface MasterContractDtls {
  totalFinanceAmt: string
  totalDownPmt: number
  pastDueAmt: number
  totalPaidAmt: any
  totalRemainingAmt: string
  nextInstallmentAmt: number
  finalInstallmentAmt: number | string
  adminFeeAmt: number
  firstInstallmentDate: string
  nextInstallmentDate: string
  finalInstallmentDate: string
  dueDate: string
  installmentFrequency: string
  childContractLst: ChildContractLst[]
}

export interface ChildContractLst {
  totalFinanceAmt: number
  totalDownPmt: number
  pastDueAmt?: number
  totalPaidAmt: number
  totalRemainingAmt: number
  nextInstallmentAmt: number
  finalInstallmentAmt: number
  adminFeeAmt: number
  firstInstallmentDate: string
  nextInstallmentDate: string
  finalInstallmentDate: string
  dueDate: string
  installmentFrequency: string
}
