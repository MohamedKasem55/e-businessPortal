import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface UpdateCRExpiryRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  expiryDate: string;
}
