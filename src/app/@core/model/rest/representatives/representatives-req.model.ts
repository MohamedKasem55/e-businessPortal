import { GenerateChallengeAndOTP } from '../common/otp.model';

export interface RepresentativesRes {
  representativeInfo: Representative[];
}

export interface Representative {
  repID: string;
  repGivenName: string;
  repMiddleName: string;
  repPaternalName: string;
  repFamilyName: string;
  repIDType: string;
  repIDNum: string;
  repSttsCd: string;
  repCrtnDate: string;
  repUsrNm: string;
  repSgntrId: string;
}

export interface RepresentativeMapped {
  repID: string;
  name: string;
  repIDNum: string;
  repUsrNm: string;
  repCrtnDate: string;
  status: string;
}

export interface RequestRepresentativeDelete {
  repAuthId: string;
  repDelReason: string;
}

export interface DetailEvent {
  buttonId: string;
  displayedData: any;
  row: Representative;
}

export interface Status {
  key: string;
  value: string;
}

export interface RequestAddRepresentative {
  repGivenName: string;
  repMiddleName?: string;
  repPaternalName?: string;
  repFamilyName: string;
  repSigntrImageType?: string;
  repImage: string;
  repSigntrNote?: string;
  repBirthDt: string;
  repStartDate: string;
  repEndDate: string;
  repAccntsAuthLst: string[];
  repPowerLst: string[];
  repPhone: RepPhoneDTO;
  repIdentityInfo: RepIDDtlsDTO;
}

export interface RepPhoneDTO {
  repPhoneNum: string;
  repPhoneTp?: string;
}

export interface RepIDDtlsDTO {
  repIDType?: string;
  repIDNum: string;
  repIDIssuerName: string;
  repIDIssueDt: string;
  repIDExpDt: string;
}

export interface RepresentativesAddRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  repAuthId: string;
  saudi: boolean;
}

export interface RepresentativesDetailRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  repAuthId: string;
  repGivenName: string;
  repMiddleName?: string;
  repPaternalName?: string;
  repFamilyName: string;
  repPhone: RepPhoneDTO;
  repBirthDt: string;
  repIdentityInfo: RepIDDtlsDTO;
  repStartDate: string;
  repEndDate: string;
  repAccntsAuthLst: AccountAuth[];
  repPowerCodeId: string;
  repPowerLst: Power[];
  repSttsCd: string;
}

export interface AccountAuth {
  fullAccountNumber: string;
  alias: string;
  currency: string;
  accountPk: number;
  availableBalance: number;
  enabled: boolean;
}

export interface Power {
  repPower: string;
  dis: string;
  enabled: boolean;
}

export interface RequestRepresentativeModify {
  repAuthId: string;
  repAccntsModLst: RepAccntModDtlsDTO[];
  repPowerModLst: RepPowerModRequestDTO[];
  updtdRepEndDt: string;
}

export interface RepAccntModDtlsDTO {
  fullAccountNumber: string;
  enabled: true;
}

export interface RepPowerModRequestDTO {
  repPower: string;
  enabled: true;
}

export interface ResponseRepresentativeMod {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  repAuthId: string;
}
