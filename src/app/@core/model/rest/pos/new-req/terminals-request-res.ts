import { GenerateChallengeAndOTP } from "../../common/otp.model"

export interface POSTerminalsRequestRes {
    generateChallengeAndOTP?: GenerateChallengeAndOTP
    merchantId?: string
    terminals:string[];
  }