import {Batch} from "../../common/batchResponse"

export interface BatchSadad extends Batch {
  serviceType: string
  transactionType: string
  applicationType: string
  paymentId: string
  unusedBalance: number
  beneficiaryName: string
  errorCode: string
  errorDescription: string
  details: DetailSadad[]
  fees: FeeSadad[]
  violations: ViolationSadad[]
  userHasPrivilege: boolean
}

export interface DetailSadad{
  egovSadadDetailsPk: number
  batch: number
  labelKey: string
  labelResource: string
  value: string
  list: string
  keyId: number
}

export interface FeeSadad{
  egovSadadFeesPk: number
  batch: number
  feeType: string
  feeAmount: number
}

export interface ViolationSadad{
  egovSadadViolationsPk: number
  batch: number
  violationNumber: string
  violationAmount: number
}

export interface BatchListSadad{
  toProcess: BatchSadad[]
  toAuthorize?: BatchSadad[]
  notAllowed: BatchSadad[]
}


