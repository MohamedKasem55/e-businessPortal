import {BaseResponse} from "../common/base-response";

export interface ValidUserResponse extends BaseResponse {
  softToken: boolean;
  otp: boolean;
  challenge: Challenge;
  fingerprintFaceId: boolean;
  companyList: MultiUserCIC[];
}

export interface Challenge {
  serial: string;
  challengeCode: string;
  isNoQr: boolean;
}

export interface MultiUserCIC {
  profileNumber: string;
  users: CompanyUser[];
}

export interface CompanyUser {
  username: string;
  userId: string;
  profileNumber: string;
}
