import { ErrorResponse } from '../../ask/ask-alrajhi/ask-alrajhi-res.model';
import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface FinalOfferResponse {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  requiredSFA: boolean
  customerOfferDetails: CustomerOfferDetails
}


export interface CustomerOfferDetails {
  totalFinanceAmt: number
  totalDownPayment: number
  totaldminFeeAmt: number
  custOfferVehicleGroupLstItemTypes: CustOfferVehicleGroupLstItemType[]
  installmentsList: InstallmentsList[]
}

export interface CustOfferVehicleGroupLstItemType {
  product: string
  campaign: string
  dealerName: string
  dealerType: string
  brandName: string
  modelName: string
  modelYear: string
  vehicleVariant: string
  vehicleSegment: string
  vehiclesNum: string
  vehiclePrice: number
  vehicleType: string
  vehicleCategory: string
  gracePeriod: string
  adminFeeAmt: number
  tenure: string
  profitRate: number
  defaultProfitRate: number
  pmtFrequency: string
  minDownPmt: number
  downPmt: number
  ballonPmt: number
  firstInstallmentAmt: number
  insurancePer: string
  currentYearGroup: number
  totalGroups: number
  quotationNum: string
  quotationDate: string
}

export interface InstallmentsList {
  installmentNum: number
  monthlyInstallmentAmt: number
  installmentDate: string
}
