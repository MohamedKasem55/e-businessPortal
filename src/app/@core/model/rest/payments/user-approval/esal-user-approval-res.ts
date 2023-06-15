
export interface EsalUserApprovalRes {
  batchList: {
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
  sadadInvoiceBatchPk: number;
  invoiceId: string;
  invoiceCode: string;
  billCategory:string;
  billerId: string;
  billerName: string;
  buyerName: string;
  amountDue: number;
  amountPayment: number;
  currency: string;
  dateDue: Date;
  billType: string;
  amountRangeFrom: number;
  amountRangeTo: number;
  additionalDetails: string;
  additionalDetailsAr: string;
  permission: string;
  returnCode: string;
  amount: number;
  pdfSecurityLevelsDTOList: SecurityItem[];
  futureStatus: string;
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

