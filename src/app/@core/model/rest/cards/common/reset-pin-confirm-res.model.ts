import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface  PrepaidCardsResetPinConfirmResModel {
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
  }