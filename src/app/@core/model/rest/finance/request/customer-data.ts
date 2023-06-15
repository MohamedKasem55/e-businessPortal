import { ErrorResponse } from '../../common/base-response';
import { GenerateChallengeAndOTP } from '../../common/otp.model';
export interface CustomerDataRes {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP | null
  companyDetails: CompanyDetails
  posBusinessDataDtls: PosBusinessDataDtls
  sanadPhoneNumber: string
  sanadidNumber: string
  embossingNames: any
}



export interface CompanyDetails {
  cicNum: string |null
  cicStatus: string |null
  registrationDate: string
  closureDate: any
  blackListStatusCode: string |null
  juridicalName: string
  juridicalNameOtherLang: string
  juridicalStatus: string
  ctryOfIncorporation: string
  residentFlg: string
  economicActivitySector: string
  establishmentDate: string
  employeesNumber: any
  economicActivitySubCode: string
  economicActivityArea: number
  registrationType: RegistrationType
  mciContractNumber: any
  mciContractDate: any
  taxBeanCtryCode: any
  amendmentDate: string
  ownerCic: string
  waselStreetName: string
  waselBuildingNumber: string
  waselUnitNumber: string
  waselCtryCode: string
  waselCityCode: string
  waselZipCode: string
  waselAddCode: string
  waselDistrict: string
  preferredLanguage: string
  headBranch: string
  acctCurrency: any
  bicCode: any
  supervision: string
  nationalForexAuthCode: any
  landlineContact: LandlineContact
  mobileContact: MobileContact
  numPagerContact: NumPagerContact
  faxContact: any
  email: string
  preferredEmail: boolean
  website: any
  branchOfficers: any
  owners: Owner[]
  juridicalOwners: any
  accountNumberList: string[]
}

export interface RegistrationType {
  type: string
  number: string
  issueDate: IssueDate
  expiryDate: ExpiryDate
  ctryCode: string
  cityCode: string
  cityName: any
}

export interface IssueDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface ExpiryDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface LandlineContact {
  telephoneType: any
  intlPrefix: string
  areaCode: string
  number: string
  extension: string
  preferredFlg: boolean
}

export interface MobileContact {
  telephoneType: any
  intlPrefix: string
  areaCode: string
  number: string
  extension: any
  preferredFlg: boolean
}

export interface NumPagerContact {
  telephoneType: any
  intlPrefix: string
  areaCode: string
  number: string
  extension: any
  preferredFlg: boolean
}

export interface Owner {
  cicNum: string
  roleType: any
  ownerName: string
  ownerNameEN: string
  ownerNameAR: any
  familyNameEN: string
  familyNameAR: string
  director: boolean
  nationality: string
  idNumber: string
  idType: string
  idExpiryDate: IdExpiryDate
  birthDate: BirthDate
  ownership: any
  occupation: any
  gender: any
  maritalStatus: any
  employeeName: any
  employmentDate: EmploymentDate
  basicSalary: any
  totalSalary: any
  employerAddress: any
  employerPOBox: any
  employerPostalCode: any
  employerCity: any
  employerNationality: any
  simahAuth: boolean
  ctryCode: string
  regionCode: string
  cityCode: string
  streetName: string
  buildingNumber: string
  unitNumber: string
  zipCode: string
  addCode: string
  district: string
  poBox: any
  email: any
  preferredContact: string
  intDialCode: any
  mobileNumber: string
  officeNumber: any
  homeNumber: any
  faxNumber: any
}

export interface IdExpiryDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface BirthDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface EmploymentDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface PosBusinessDataDtls {
  contactPersonName: any
  email: any
  intDialCode: string
  mobileNumber: string
  firstRePymtDate: any
  rePymtPeriod: any
  simahAuth: boolean
  businessOutletsNum: any
  businessOutletsType: any
  businessModelSalesDesc: any
  businessLocation: any
  businessActivities: any
  businessType: any
  establishmentDate: any
  sector: Sector
  subSector: SubSector
  industry: any
  terminalsNumber: any
  posStartDate: any
  fromCortexFlg: boolean
  termCortexNumber: any
  termCortexDate: any
  facilityLst: any
  keyFinancialInfo: any
}

export interface Sector {
  key: string
  value: string
}

export interface SubSector {
  key: string
  value: string
}
