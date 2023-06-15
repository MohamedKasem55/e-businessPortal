import { ErrorResponse } from '../../common/base-response';
import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface ExternalAppTokenRes {
  errorCode: string;
  errorDescription: string;
  errorResponse: ErrorResponse;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  redirectLink: string;
  token: string;
}
