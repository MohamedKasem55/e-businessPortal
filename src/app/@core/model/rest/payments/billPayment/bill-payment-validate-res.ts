import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface BillPaymentValidateRes {
  refusedBatchList: BillBatch[]
  batchListsContainer: BatchListsContainer;
  total: TotalBillAmount
  generateChallengeAndOTP: GenerateChallengeAndOTP
}

export interface BatchListsContainer {
  toProcess: BillBatch[];
  toAuthorize?: BillBatch[];
  notAllowed: BillBatch[];
}

export interface BillBatch extends BaseBatch {
  process: string;
  billCode: string;
  billRef: string;
  nickname: string;
  addDescriptionAr: string;
  addDescriptionEn:string;
  detailsDescriptionAr: string;
  paymentType: string;
  amount:number
  amountOriginal: number;
  amountPayment: number;
  dueDate: Date;
  vatAmount: number;
  amountWithoutVat: number;
  newAddBill: boolean;
  futureStatus:string
}

export interface TotalBillAmount {
  totalAmountRefused: number;
  totalAmountNotAllowed: number;
  totalAmountToProcess: number;
  totalAmountToAuthorize: number;
  totalVatAmountRefused: number;
  totalVatAmountNotAllowed: number;
  totalVatAmountToProcess: number;
  totalVatAmountToAuthorize: number;
  totalAmountWithoutVatRefused: number;
  totalAmountWithoutVatNotAllowed: number;
  totalAmountWithoutVatToProcess: number;
  totalAmountWithoutVatToAuthorize: number;
}

export interface BaseBatch {
  batchPk: number
  type: string
  status: string
  accountNumber: string
  accountAlias: string
  rejectedReason: string
  initiationDate: Date
  hostRequest: HostRequestDTO
  nextStatus: string
  securityLevelsDTOList: BatchSecurity[]
  futureSecurityLevelsDTOList: BatchSecurity[]
  beStatus: string
}

export interface BatchSecurity {
  batchSecurityPk: number;
  level: number;
  status: string;
  updater: string;
  updateDate: Date;
  userPk: number;
  auditStatus: string;
  pdfStatus: string;
}

export interface HostRequestDTO {
  hostRequestsPk: number;
  fileReference: string;
  fileType: string;
  fileStatus: string;
  requestDate: Date;
  fileName: string;
  requestTime: Date;
  transfaerDate: Date;
  companyDTO: any;
  accountFrom: string;
  newTransferDate: Date;
  rejectionReason: string;
  userFileName: string;
  batchList: BatchDTO[];
}

export interface BatchDTO {
  batchPk: number;
  companyFk: number
  cic: string;
  type: string;
  status: string;
  accountFromFk: string;
  accountNumber: string;
  accountAlias: string;
  rejectedReaso: string;
  initiationDate: Date;
  hostRequest: HostRequestDTO;
  initiatedBy: string;
  approvedDate: Date;
  approvedBy: string;
  nextStatus: string;
  securityLevelsDTOList: BatchSecurity[];
  futureSecurityLevelsDTOList: BatchSecurity[];
  initiationResponseRecordWSDTO: RecordWSDTO;
  authorizationResponseRecordWSDTO: RecordWSDTO;
  beStatus: string;
  nickName: string;
}
export interface BillProcessedTransactionsRes {
  processedTransactionList: {
    items: BillBatch[]
    size: number;
    total: number;
  }
}
export interface RecordWSDTO {
  batchId: number
  returnCode: string
  reason: string
  levelStatusList: {
    level: number
    status: string
  }[]
}
