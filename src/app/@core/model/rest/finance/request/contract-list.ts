import { ErrorResponse } from "../../common/base-response"
import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface ContractList {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  size: number
  page: any
  total: number
  contractItems: ContractItem[]
}


export interface ContractItem {
  dossierID: string
  contractDate: ContractDate
  amt: number
  dossierType: string
  productKey: ProductKey
  dossierStatus: string
  profit: number
  hasDisbursmentDossier: boolean
  firstDisbursmentDossierStatus: any,
  currency:string,
  childContracts: ChildContract[]
}

export interface ContractDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface ProductKey {
  cIst: string
  channel: string
  macroFacility: string
  facility: string
  productCode: string
}

export interface ChildContract {
  dossierID: string
  cicNum: string
  contractDate: any
  productKey: ProductKey2
  dossierType: string
  profit: number
  dossierStatus: string
  picBank: string
  amt: number
}

export interface ProductKey2 {
  cIst: any
  channel: string
  macroFacility: string
  facility: string
  productCode: string
}
