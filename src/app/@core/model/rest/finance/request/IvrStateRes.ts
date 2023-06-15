import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface IvrStateRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  custCIC: string
  serviceCd: string
  docName: string
  rqStatusCd: string
  rqStatusDesc: string
}
