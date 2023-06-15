import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface  CardsResetPinValidateResModel {
  errorCode: string;
  errorDescription: string;
  errorResponse: any;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  typeOperation: string;
  cardSeqNumber: string;
  newPinNumber: string;
  oldPinNumber: string;
}