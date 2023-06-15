import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface AgreementValidateRes {
  companyPayrollAgreement: CompanyPayrollAgreement;
  generateChallengeAndOTP: GenerateChallengeAndOTP
}

export interface CompanyPayrollAgreement {
  agreementId: number;
  agreementTemplateId: number;
  companyFk: number;
  profileNumber: string;
  startDate: Date;
  endDate: Date;
  initiatedBy: string;
  classification: AgreementClassification; //New or old customer
  status: AgreementStatus; //active or NOT
  account: string;
  MOL_ID: string;
  tabadulCompanyCode: string;
  userFolder: string;
  employeeCount: number;
  initiatorMobileNumber: string;
  initiatorID: string;
  authorizerMobileNumber: string;
}

export enum AgreementClassification {
  NEW = "NEW", OLD = "OLD"
}

export enum AgreementStatus {
  INITIATED = ("INITIATED")
  , ACTIVE = ("ACTIVE")
  , NOT_ACTIVE = ("NOT_ACTIVE")
  , FAILED = ("FAILED")
}
