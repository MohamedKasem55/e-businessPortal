import { GenerateChallengeAndOTP} from "../../common/otp.model"

export interface  CardCredentialOtpVerificationResModel {
  errorCode: string
  errorDescription: string
  errorResponse: any
  generateChallengeAndOTP: GenerateChallengeAndOTP
  cvv: string
  expiryDate: string
  iban: string
  holderName: string
}