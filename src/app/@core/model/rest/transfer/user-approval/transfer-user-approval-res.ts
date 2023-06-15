import {Account} from "../../common/account";
import {SecurityDetail} from "../../common/security-detail.model";


export interface TransferUserApprovalRes {
  transfers: {
    items: TransferBatchItem[]
    size: number;
    total: number;
  }
}

export interface TransferBatchItem {
  batchPk: number;
  profileNumber: string;
  accountFrom: Account;
  batchType: string;
  status: string;
  initiationDate: Date;
  beneficiaryAccount: string;
  beneficiaryName: string;
  bankName: string;
  country: string;
  amount: string;
  debitAmount: string;
  currency: string;
  benefCurrency: string;
  reason: string;
  purposeDescriptionEN: string;
  purposeDescriptionAR: string;
  rejectedReason?: any;
  dateDeletion?: any;
  remarks: string;
  securityDetails: SecurityDetail[];
}

///////////////////////////////////////////////


export interface BeneficiariesRes {
  beneficiaries: {
    items: BeneficiariesBatchItem[],
    size: number
    total: number
  }
}

export interface BeneficiariesBatchItem {
  batchPk: number
  profileNumber: string
  batchType: string
  status: string
  initiationDate: string
  beneficiaryAccount?: string
  beneficiaryName?: string
  email?: string
  phoneNumber?: string
  bankName: string
  country?: string
  category?: string
  currency: string
  swiftCode: string
  rejectedReason?: string
  dateDeletion: any
  createdBy: string
  securityLevels: SecurityDetail[]
}

////////////////////////////////////////

export interface StandingOrdersRes {
  standingOrderList: {
    items: StandingOrdersBatchItem[],
    size: number;
    total: number;
  }
}


export interface StandingOrdersBatchItem {
  batchPk: number
  type: string
  status: string
  accountNumber: string
  accountAlias: any
  rejectedReason?: string | undefined
  initiationDate: string
  hostRequest: any
  nextStatus: any
  securityLevelsDTOList: SecurityDetail[]
  futureSecurityLevelsDTOList: any
  beStatus: any
  profileNumber: string
  erNumber: any
  beneficiarySequence: any
  mandateNumber: any
  beneficiaryAccount?: string | undefined
  beneficiaryName?: string | undefined
  option: string
  paymentType: string
  amountType: any
  amount: number
  dayMonth: any
  dateFrom: any
  dateTo: any
  orderDate: any
  paymentNumber: any
  purpose: any
  remarks: any
  pdfSecurityLevelsDTOList: SecurityDetail[]
  futureStatus: string
}

/////////////////////////////////////////////////

export interface BulkPaymentsRes {
  size: number
  total: number
  bulkPaymentsList: BulkPaymentsBatchItem[]
}

export interface BulkPaymentsBatchItem {
  sessionInfo: any
  offset: any
  max: any
  orders: any
  batchPk: number
  companyFk: number
  cic: any
  type: string
  status: string
  accountFromFk: number
  accountNumber: string
  accountAlias: any
  rejectedReason: any
  initiationDate: string
  hostRequest: any
  initiatedBy?: string
  approvedDate: any
  approvedBy: any
  nextStatus: any
  securityLevelsDTOList: SecurityDetail[]
  futureSecurityLevelsDTOList: any
  initiationResponseRecordWSDTO: any
  authorizationResponseRecordWSDTO: any
  beStatus: any
  nickName: any
  batchFk: any
  fileReference: string
  systemFileName: string
  tmpSystemFileName: any
  userFileName: string
  paymentDate: string
  count: string
  totalAmount: number
  cancelled: any
  rajhiRecordCount: number
  rajhiRecordAmount: number
  localRecordCount: number
  localRecordAmount: number
  cancelledFilename: any
  batchName: string
  fileHash: any
  companyCode: any
  userFolder: any
  customerReference: any
  totalRecordCount: any
  account: any
  remarks: any
  rajhiFeesAmount: any
  localFeesAmount: any
  rajhiFeesRecord: any
  localFeesRecord: any
  fileHeader: any
  fileLinesList: any
  chargeAccountNumber: any
  valueDate: any
  amount: number
  totalAmountPlusFees: number
  pdfSecurityLevelsDTOList: SecurityDetail[]
  account21Length: string
  account18Length: string
  futureStatus: string
  statusX:any
}


