
export interface GovernmentPaymentsUserApprovalRes {
  requestStatusEgovSPList: {
    items: BatchItem[]
    size: number;
    total: number;
  }
}

export interface GovernmentRefundsUserApprovalRes {
  requestStatusEgovSRList: {
    items: BatchItem[]
    size: number;
    total: number;
  }
}

export interface BatchItem {
  batchPk: number;
  type: string;
  status: string;
  accountNumber: string;
  accountAlias: string;
  rejectedReason?: any;
  initiationDate: Date;
  hostRequest: HostItem;
  nextStatus: string;
  securityLevelsDTOList: SecurityItem[];
  futureSecurityLevelsDTOList: SecurityItem[];
  beStatus: string;
  cic: string;
  parentBatchFk: any;
  serviceType: string;
  transactionType: string;
  applicationType: string;
  paymentId: string;
  unusedBalance: number;
  amount: number;
  beneficiaryName: string;
  errorCode: string;
  errorDescription: string;
  details: GovDetail[];
  fees: GovFees[];
  violations: GovViolations;
  userHasPrivilege: boolean;
  pdfSecurityLevelsDTOList: SecurityItem[];
  futureStatus: string;
}

export interface GovDetail{
  egovSadadDetailsPk: number;
  batch: number;
  labelKey: string;
  labelResource: string;
  value: string;
  list: string;
  keyId: number;
}

export interface GovFees{
  egovSadadFeesPk: number;
  batch: number;
  feeType: string;
  feeAmount:number;
}

export interface GovViolations{
  egovSadadViolationsPk: number;
  batch: number;
  violationNumber: string;
  violationAmount: number;
}

export interface HostItem {
  hostRequestsPk: number;
  fileReference: string;
  fileType:	string;
  fileStatus:	string;
  requestDate: Date;
  fileName: string;
  requestTime: Date;
  transfaerDate: Date;
  companyDTO: CompanyItem;
  accountFrom: string;
  newTransferDate: Date;
  rejectionReason: string;
  userFileName: string;
  batchList	:string;//
  prepared: boolean;
}

export interface SecurityItem {
  batchSecurityPk: number;
  level: number;
  status: string;
  updater: string;
  updateDate: string;
  userPk?: any;
  auditStatus?: any;
  pdfStatus?: any;
}

export interface CompanyItem {}

