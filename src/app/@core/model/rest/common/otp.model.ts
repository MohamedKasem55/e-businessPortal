export class GenerateChallengeAndOTP {
  typeAuthentication: 'STATIC' | 'OTP' | 'CHALLENGE' | 'IVR'= 'OTP';
  serial?: string;
  challengeCode?: any;
  mobileNumber?: string;
  isNoQr?: boolean;
  callBackRequestId?: string;
  owner?: boolean;
  qrcode?:any;
  timeToLive?: number | undefined;
}
export interface RequestValidate {
  otp?: string;
  password?: string;
  response?: string;
  challengeNumber?: string;
  challengeResponse?:string;
}
