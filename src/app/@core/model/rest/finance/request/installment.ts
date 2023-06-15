import { ErrorResponse } from '../../common/base-response';
import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface InstallmentListResponse {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  installments: Installment[]
}
export interface Installment {
  segment:	string
  variant	:string
  dealerName:	string
  dealerType:	string
  brandName:	string
  modelName	:string
  chassisNum:	string
  plateNum:	string
  vehicleFinanceAmt:	number
  downPaymentAmt:	number
  pastDueAmt:	number
  paidAmt:	number
  remainingFinanceAmt:	number
  firstInstallmentDate:	string
  nextInstallmentDate:	string
  nextInstallmentAmt:	number
  finalInstallmentDate:	string
  finalInstallmentAmt:	number
  adminFeesAmt	:number
  insuranceRate	:number
  profitRate:	number
  installmentFrequency	:string
  dueDate:	string
  financingTenure:	string
  installmentDueDate:	string
  installmentDateCaleder:	string
  installmentDate	:string
  installmentTimestamp	:string
  financeAmount	:number
  installmentAmt	:number
  installmentStatus	:string
  installmentTypeList: InstallmentTypeList[]
  purposeOfUse:	string
}

export interface InstallmentTypeList {
  dueDate: DueDate
  amt: number
  status: string
}

export interface DueDate {
  dateCaleder: string
  date: string
  timestamp: string
}
