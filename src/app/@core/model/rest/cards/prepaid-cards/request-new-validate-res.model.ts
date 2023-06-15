import { GenerateChallengeAndOTP } from "../../common/otp.model";
import { PrepaidCardsRequestNewDSO } from "./request-new-validate-req.model";

export interface PrepaidRequestNewValidateResModel {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO;
  errorCode: string;
  errorDescription: string;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}
