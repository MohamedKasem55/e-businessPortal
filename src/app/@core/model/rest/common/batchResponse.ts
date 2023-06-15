export interface BatchList {
  toProcess: Batch[];
  toAuthorize?: Batch[];
  notAllowed: any[];
  toReject: any[];
  toProcessAmounts?: ToProcessAmounts
  toAuthorizeAmounts?: ToAuthorizeAmounts
  total?:any
}

export interface BatchResponse {
  batchList: BatchList;
}

export interface Batch {
  feesAmount:string
  account18Length?: string
  account21Length?: string
  accountAlias?: string
  accountFromFk?: number
  amount?: number
  approvedBy?: string
  approvedDate?: string
  authorizationResponseRecordWSDTO?: AuthorizationResponseRecordWSDTO
  batchPk?: number
  cic?: string
  cardNumber?: string
  companyFk?: number
  futureSecurityLevelsDTOList?: Array<FutureSecurityLevelsDtolist>
  futureStatus?: BatchDTO.FutureStatusEnum
  hostRequest?: HostRequestDTO
  initiatedBy?: string
  initiationDate?: string
  initiationResponseRecordWSDTO?: InitiationResponseRecordWSDTO
  max?: number
  nextStatus?: string
  offset?: number
  order?: string
  orderType?: string
  pdfSecurityLevelsDTOList?: Array<FutureSecurityLevelsDtolist>
  rejectedReason?: string
  securityLevelsDTOList?: Array<FutureSecurityLevelsDtolist>
  sessionInfo?: ISessionInfo
  status?: string
  type?: string
  accountNumber: any
  remarks: any
  email: any
  currency: any
  beStatus: string
  typeOperation?: string
  beneficiary: string
  accountTo: string
  bankName: string,
}

export interface FutureSecurityLevelsDtolist {
  batchSecurityPk: any
  level: number
  status: string
  updater?: string
  updateDate: any
  userPk: any
  auditStatus: any
  pdfStatus: any
}

export interface HostRequestDTO {
  accountFrom?: string
  batchList?: Array<Batch>
  companyDTO?: any
  fileName?: string
  fileReference?: string
  fileStatus?: string
  fileType?: string
  hostRequestsPk?: number
  newTransferDate?: string
  prepared?: boolean
  rejectionReason?: string
  requestDate?: string
  requestTime?: string
  transfaerDate?: string
  userFileName?: string
}

export interface InitiationResponseRecordWSDTO {
  batchId?: number
  levelStatusList?: Array<LevelStatusPair>
  reason?: string
  returnCode?: string
  status?: InitiationResponseRecordWSDTO.StatusEnum
}

export namespace InitiationResponseRecordWSDTO {
  export type StatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const StatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as StatusEnum,
    PROCESS: 'PROCESS' as StatusEnum,
    PENDING: 'PENDING' as StatusEnum,
  }
}

export namespace BatchDTO {
  export type FutureStatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const FutureStatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as FutureStatusEnum,
    PROCESS: 'PROCESS' as FutureStatusEnum,
    PENDING: 'PENDING' as FutureStatusEnum,
  }
}

export interface AuthorizationResponseRecordWSDTO {
  batchId?: number
  levelStatusList?: Array<LevelStatusPair>
  reason?: string
  returnCode?: string
  status?: AuthorizationResponseRecordWSDTO.StatusEnum
}

export interface LevelStatusPair {
  level?: number
  status?: string
}

export namespace AuthorizationResponseRecordWSDTO {
  export type StatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const StatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as StatusEnum,
    PROCESS: 'PROCESS' as StatusEnum,
    PENDING: 'PENDING' as StatusEnum,
  }
}

export interface ISessionInfo {
  language?: string
  profileNumber?: string
  sessionId?: string
  uid?: string
  userId?: string
  userPk?: number
  workstationId?: string
}

export interface ToProcessAmounts {
  totalAmount: number
  totalFee: number
}

export interface ToAuthorizeAmounts {
  totalAmount: number
  totalFee: number
}
