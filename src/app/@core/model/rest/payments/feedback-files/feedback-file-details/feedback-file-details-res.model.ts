import { SecurityItem } from '../../user-approval/aramco-payment-user-approval-res';

export interface ListLinesBillPaymentFiles {
  accountFrom: string;
  billCode: string;
  billReference: string;
  amount: number;
  returnCode: string;
  returnCodeMsg: string;
  billNameEn: string;
  billNameAr: string;
  process: string;
  processText: string;
}

export interface BillFeedbackFileDetailsRes {
  billPaymentDetailsOutput: {
    listLinesBillPaymentFiles: ListLinesBillPaymentFiles[];
  };
}

export interface EsalFeedbackFileDetailsRes {
  sadadInvoiceDetailsOutputDTO: {
    listLinesSadadInvoiceFiles: ListLinesSadadInvoiceFiles[];
  };
}

export interface ListLinesSadadInvoiceFiles {
  accountFrom: string;
  billCategory: string;
  billerId: string;
  billerName: string;
  invoiceID: string;
  amount: number;
  returnCode: string;
  returnCodeMsg: any;
  process: string;
  processText: string;
}

export interface GovSadadFeedbackFileDetailsRes {
  egovSadadDetailsOutputDTO: {
    linesGovSadadFilesList: LinesGovSadadFilesList[];
  };
}

export interface LinesGovSadadFilesList {
  recordType: string;
  recordId: number;
  amount: number;
  refundStatus: string;
  refundId: string;
  sadadErrorCode: string;
  errorDescription: string;
  dbDetails: DbDetails;
  returnCode: string;
  returnCodeMsg: any;
}

export interface DbDetails {
  sessionInfo: any;
  offset: any;
  max: any;
  orders: any;
  batchPk: number;
  companyFk: number;
  cic: string;
  type: any;
  status: string;
  accountFromFk: number;
  accountNumber: string;
  accountAlias: string;
  rejectedReason: string;
  initiationDate: string;
  hostRequest: any;
  initiatedBy: any;
  approvedDate: string;
  approvedBy: string;
  nextStatus: any;
  securityLevelsDTOList: SecurityItem[];
  futureSecurityLevelsDTOList: any;
  initiationResponseRecordWSDTO: any;
  authorizationResponseRecordWSDTO: any;
  beStatus: string;
  nickName: string;
  serviceType: string;
  transactionType: string;
  applicationType: string;
  paymentId: string;
  unusedBalance: number;
  amount: number;
  beneficiaryName: string;
  errorCode: any;
  errorDescription: any;
  details: Details[];
  fees: Fees[];
  violations: any;
  userHasPrivilege: boolean;
  pdfSecurityLevelsDTOList: SecurityItem[];
  account21Length: string;
  account18Length: string;
  futureStatus: string;
}

export interface Details {
  egovSadadDetailsPk: number;
  batch: any;
  labelKey: string;
  labelResource: string;
  value: string;
  list: any;
  keyId: number;
}

export interface Fees {
  egovSadadFeesPk: number;
  batch: any;
  feeType: string;
  feeAmount: number;
}
