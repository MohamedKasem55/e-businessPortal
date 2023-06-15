import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface IvrRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  bankTrxnRef: string
}
