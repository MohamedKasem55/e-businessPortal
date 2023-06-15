import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface ProxyManageResModel {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  requiredSFA: boolean;
  response: string;
}
