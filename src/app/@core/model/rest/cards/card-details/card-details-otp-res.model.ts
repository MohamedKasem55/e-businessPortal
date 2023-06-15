import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface CardsDetailsOtpResponseModel {
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
}