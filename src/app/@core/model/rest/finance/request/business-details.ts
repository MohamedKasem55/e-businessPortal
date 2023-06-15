import { ErrorResponse } from '../../common/base-response';
import { KeyValueModel } from '../../common/key-value.model';
import { dossierType } from './dossier_type';
import { GenerateChallengeAndOTP } from '../../common/otp.model';
export interface CustomerBusinessDetails {
  applicantType?: string | undefined | undefined
  branchType: KeyValueModel| string |undefined
  businessActivity: string| undefined | undefined
  businessLocation: KeyValueModel| string | undefined
  businessNationalAddress?: string| undefined
  businessOutletsNum: string| undefined
  businessType: KeyValueModel | string
  establishmetDateHijri?:string| undefined,
  accountNumberList?:Array<string> | null,
  establishmentDate?:string,
  businessOutletsType?:string,
  businessActivities?:string,

}

export interface OpenDOSSIERREQ{
  accountNumber: string,
  dossierType: dossierType.CRL | dossierType.DIS,
  establishmentDate: string,
  financeProductCode:string,
  posBusinessDataDetailsl:CustomerBusinessDetails
}

export interface OpenDossierRes {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP | null
  disbursmentDossierId: string
}

export interface CustomerBusinessDetailsRes {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: any
  requiredSFA: boolean
  customerBusinessDetails: CustomerBusinessDetails[]
  businessCRDtlsLstItems: BusinessCrdtlsLstItem[]
  locationsLsts: LocationsLst[]
  branchTypesLsts: BranchTypesLst[]
  businessTypesLsts: BusinessTypesLst[]
}

export interface BusinessCrdtlsLstItem {
  crnumber: any
  crtype: any
  unn: any
  businessType: any
  businessIndustryType: any
  issueDate: any
  issueDateHijri: any
  expiryDate: any
  expiryDateHijri: any
}

export interface LocationsLst {
  businessLocation: string[]
}

export interface BranchTypesLst {
  branchType: string[]
}

export interface BusinessTypesLst {
  businessType: string[]
}




