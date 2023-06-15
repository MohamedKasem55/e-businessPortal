import { GenerateChallengeAndOTP } from "../../common/otp.model";

  export interface askAlRajhiResModel {
    errorCode: string;
    errorDescription: string;
    errorResponse: ErrorResponse;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
    ticketCode: any;
  }

  export interface ErrorResponse {
    englishMessage: string
    arabicMessage: string
    code: string
    description: string
    reference?: string
  }
  