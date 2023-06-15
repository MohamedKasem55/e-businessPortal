import { GenerateChallengeAndOTP } from '../common/otp.model';

export interface EligibilityInquiry {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  cic: string;
  eligibilityFlg: boolean;
  activeAcctNum: number;
  maxNumAcctAllowed: number;
  employeeFlg: boolean;
  branch: BranchDTO;
}

export interface BranchDTO {
  branchPk: number;
  branchId: string;
  branchRbs5: string;
  branchLegacy5: string;
  branchName: string;
  branchNameEn: string;
  lgEnabled: boolean;
  lcEnabled: boolean;
  collecEnabled: boolean;
  branchInfo: BranchInfoDTO;
}

export interface BranchInfoDTO {
  branchInfoPk: number;
  cityEn: string;
  cityAr: string;
  locationEn: string;
  locationAr: string;
  mapsUrl: string;
  contactPerson: string;
}

export interface CreateAccountReq {
  acctNum?: string;
  acctType: string;
  branchIdent: string;
  acctSubCategory?: string;
  currency: string;
  createMembershipFlg?: boolean;
  requestValidate?: ValidatePaymentsReq;
}

export interface ValidatePaymentsReq {
  challengeResponse?: string;
  challengeNumber?: string;
  password?: string;
  otp: string;
}

export interface CreateAccountRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  additionalAcctRelId: string;
  cic: string;
  acctNum: string;
  acctType: string;
  branchIdent: string;
  iban: string;
  remitterId: string;
}
