import { ErrorResponse } from '../../ask/ask-alrajhi/ask-alrajhi-res.model';
import { GenerateChallengeAndOTP } from '../../common/otp.model';


export interface preliminaryCheck {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  checkKeyItems: CheckKeyItem[]
  errorList: string[]
}



export interface CheckKeyItem {
  macroFacility: string
  facility: string
  productCode: string
  checkCode: any
  checkResult: string
  checkReason: string
  avgBal: number
  maxIndicativeAmt: number | string
  eligibleFlg: string
}
