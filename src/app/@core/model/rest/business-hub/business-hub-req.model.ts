import { GenerateChallengeAndOTP } from '../common/otp.model';

export interface InitRegistrationRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface RegisterNewZIDReq {
  storeUsername: string;
  fromAcct: string;
  name: string;
  email: string;
  mobile: string;
  requestValidate?: ValidatePaymentsReq;
}

export interface RegisterNewQOYODReq {
  organizationName: string;
  fromAcct: string;
  user: RegisterNewQOYODUserReq;
  requestValidate?: ValidatePaymentsReq;
}

export interface RegisterNewQOYODUserReq {
  firstName: string;
  lastName: string;
  email: string;
  mobileContact: string;
}

export interface ValidatePaymentsReq {
  challengeResponse?: string;
  challengeNumber?: string;
  password?: string;
  otp: string;
}
