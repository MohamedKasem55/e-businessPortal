import { Account } from "../common/account";
import { GenerateChallengeAndOTP } from "../common/otp.model";

export interface WalletOnBoardingValidationResponse {
  generateChallengeAndOTP?: GenerateChallengeAndOTP;
  linkAccountDTO: Account;
}
