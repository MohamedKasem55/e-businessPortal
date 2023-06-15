import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface IPSConfigInqRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  maxQTL: string;
  maxPTL: string;
  stl: string;
  qtl: string;
}

export interface ResponseGeneric {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}
